import crypto from 'crypto'

export interface DelhiveryConfig {
	baseUrl: string
	token: string
	environment: 'sandbox' | 'production'
}

export function getDelhiveryConfig(): DelhiveryConfig {
	const baseUrl = process.env.DELHIVERY_API_BASE || ''
	const token = process.env.DELHIVERY_API_TOKEN || ''
	const environment = (process.env.DELHIVERY_ENV || 'sandbox') as 'sandbox' | 'production'
	if (!baseUrl || !token) {
		throw new Error('Delhivery config missing: set DELHIVERY_API_BASE and DELHIVERY_API_TOKEN')
	}
	return { baseUrl, token, environment }
}

function authHeaders(token: string): Record<string, string> {
	return {
		Authorization: `Token ${token}`,
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
}

export async function delhiveryRequest<T = unknown>(
	config: DelhiveryConfig,
	path: string,
	init?: RequestInit
): Promise<{ status: number; data: T; raw: any }> {
	const url = path.startsWith('http')
		? path
		: `${config.baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
	const res = await fetch(url, {
		...init,
		headers: {
			...authHeaders(config.token),
			...((init?.headers as Record<string, string>) || {})
		}
	})
	const text = await res.text()
	let json: any
	try {
		json = text ? JSON.parse(text) : {}
	} catch (_e) {
		json = { text }
	}
	return {
		status: res.status,
		data: json as T,
		raw: { headers: Object.fromEntries(res.headers.entries()), body: text }
	}
}

export async function checkPincodeServiceability(config: DelhiveryConfig, pincode: string) {
	const path = `/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`
	return delhiveryRequest(config, path, { method: 'GET' })
}

export interface ShipmentItemInput {
	sku: string
	name: string
	hsn?: string
	quantity: number
	price: number
	weightInGrams?: number
}

export interface CreateShipmentInput {
	orderId: string
	waybill?: string
	paymentMode: 'Prepaid' | 'COD'
	codAmount?: number
	sellerPickupLocation: {
		name: string
		address: string
		city: string
		state: string
		pincode: string
		phone: string
	}
	consignee: {
		name: string
		address: string
		city: string
		state: string
		pincode: string
		phone: string
		email?: string
	}
	parcel: {
		weightInGrams: number
		lengthCm?: number
		breadthCm?: number
		heightCm?: number
		declaredValue?: number
	}
	items?: ShipmentItemInput[]
}

export async function createShipment(config: DelhiveryConfig, input: CreateShipmentInput) {
	const path = '/api/cmu/create.json'
	// Some Delhivery deployments require a top-level `format` key with the payload nested under `data`.
	// We include it to satisfy both variants.
	const data = {
		// Delhivery Python docs show pickup_location as an object with a name
		pickup_location: { name: input.sellerPickupLocation.name },
		shipments: [
			{
				order: input.orderId,
				waybill: input.waybill,
				payment_mode: input.paymentMode,
				cod_amount: input.paymentMode === 'COD' ? input.codAmount || 0 : 0,
				// Include both legacy and modern field names to satisfy variants
				name: input.consignee.name || 'nava',
				add: input.consignee.address,
				city: input.consignee.city,
				state: input.consignee.state,
				pin: input.consignee.pincode,
				country: 'India',
				phone: input.consignee.phone,
				email: input.consignee.email,
				consignee: input.consignee.name || 'nava',
				address: input.consignee.address,
				consignee_phone: input.consignee.phone,
				consignee_email: input.consignee.email,
				weight: (input.parcel.weightInGrams || 0) / 1000,
				length: input.parcel.lengthCm,
				breadth: input.parcel.breadthCm,
				height: input.parcel.heightCm,
				declared_value: input.parcel.declaredValue,
				products_desc: input.items?.map(i => i.name).join(', ')
			}
		]
	}

	// Delhivery expects form-encoded body: format=json & data=<json-string>
	const form = new URLSearchParams()
	form.set('format', 'json')
	form.set('data', JSON.stringify(data))

	return delhiveryRequest(config, path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: form.toString()
	})
}

export async function trackShipment(config: DelhiveryConfig, waybill: string) {
	const path = `/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}`
	return delhiveryRequest(config, path, { method: 'GET' })
}

export async function getPackingSlip(
	config: DelhiveryConfig,
	awbs: string[],
	pdfSize: 'A4' | '4R' = 'A4'
) {
	const query = new URLSearchParams()
	query.set('wbns', awbs.join(','))
	query.set('pdf', 'true')
	query.set('pdf_size', pdfSize)
	const path = `/api/p/packing_slip?${query.toString()}`
	return delhiveryRequest(config, path, { method: 'GET' })
}

export async function cancelShipment(
  config: DelhiveryConfig,
  waybill: string
) {
  // Try multiple variants, return the first 2xx
  // 1) Package edit with JSON body (waybill as string)
  const jsonBody = { waybill: waybill as any, cancellation: 'true' as any }
  try {
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonBody),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // 1b) JSON body with boolean cancellation
  try {
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waybill, cancellation: true } as any),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // 2) Package edit with urlencoded form
  try {
    const form = new URLSearchParams()
    form.append('cancellation', 'true')
    // Some accounts expect waybill as repeated key, try both array and single
    form.append('waybill', waybill)
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}
  // 2b) urlencoded alternate key
  try {
    const form = new URLSearchParams()
    form.append('is_cancelled', 'true')
    form.append('waybill', waybill)
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}
  try {
    const form = new URLSearchParams()
    form.append('waybill[]', waybill)
    form.append('cancellation', 'true')
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // 3) CMU cancel as GET with query
  try {
    const r = await delhiveryRequest<any>(
      config,
      `/api/cmu/cancel.json?waybill=${encodeURIComponent(waybill)}`,
      { method: 'GET' }
    )
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // 4) CMU cancel as POST form
  try {
    const form = new URLSearchParams()
    form.set('waybill', waybill)
    const r = await delhiveryRequest<any>(config, '/api/cmu/cancel.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // 5) Edit with format=data JSON wrapper (some endpoints require this pattern)
  try {
    const form = new URLSearchParams()
    form.set('format', 'json')
    form.set('data', JSON.stringify(jsonBody))
    const r = await delhiveryRequest<any>(config, '/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (r.status >= 200 && r.status < 300) return r
  } catch (_e) {}

  // If none returned 2xx, force a final attempt to expose the latest response
  return delhiveryRequest<any>(config, '/api/p/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonBody),
  })
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
	const secret = process.env.DELHIVERY_WEBHOOK_SECRET || ''
	if (!secret) return false
	if (!signature) return false
	const hmac = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
	return signature === hmac || signature === Buffer.from(hmac, 'hex').toString('base64')
}



