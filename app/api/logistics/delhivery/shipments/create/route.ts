import { NextResponse } from 'next/server'
import { getDelhiveryConfig, createShipment, type CreateShipmentInput } from '@/lib/delhivery'

export const runtime = 'nodejs'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const input: CreateShipmentInput = {
			orderId: String(body?.orderId || ''),
			waybill: body?.waybill ? String(body.waybill) : undefined,
			paymentMode: body?.paymentMode === 'COD' ? 'COD' : 'Prepaid',
			codAmount: body?.codAmount ? Number(body.codAmount) : undefined,
			sellerPickupLocation: {
				name: String(body?.sellerPickupLocation?.name || ''),
				address: String(body?.sellerPickupLocation?.address || ''),
				city: String(body?.sellerPickupLocation?.city || ''),
				state: String(body?.sellerPickupLocation?.state || ''),
				pincode: String(body?.sellerPickupLocation?.pincode || ''),
				phone: String(body?.sellerPickupLocation?.phone || '')
			},
			consignee: {
				name: String(body?.consignee?.name || ''),
				address: String(body?.consignee?.address || ''),
				city: String(body?.consignee?.city || ''),
				state: String(body?.consignee?.state || ''),
				pincode: String(body?.consignee?.pincode || ''),
				phone: String(body?.consignee?.phone || ''),
				email: body?.consignee?.email ? String(body.consignee.email) : undefined
			},
			parcel: {
				weightInGrams: Number(body?.parcel?.weightInGrams || 0),
				lengthCm: body?.parcel?.lengthCm ? Number(body.parcel.lengthCm) : undefined,
				breadthCm: body?.parcel?.breadthCm ? Number(body.parcel.breadthCm) : undefined,
				heightCm: body?.parcel?.heightCm ? Number(body.parcel.heightCm) : undefined,
				declaredValue: body?.parcel?.declaredValue ? Number(body.parcel.declaredValue) : undefined
			},
			items: Array.isArray(body?.items)
				? body.items.map((i: any) => ({
						sku: String(i?.sku || ''),
						name: String(i?.name || ''),
						hsn: i?.hsn ? String(i.hsn) : undefined,
						quantity: Number(i?.quantity || 0),
						price: Number(i?.price || 0),
						weightInGrams: i?.weightInGrams ? Number(i.weightInGrams) : undefined
					}))
				: undefined
		}

		if (!input.orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
		if (!input.sellerPickupLocation.pincode || !input.consignee.pincode)
			return NextResponse.json({ error: 'pincodes are required' }, { status: 400 })
		if (!input.parcel.weightInGrams || input.parcel.weightInGrams <= 0)
			return NextResponse.json({ error: 'parcel.weightInGrams must be > 0' }, { status: 400 })

		const cfg = getDelhiveryConfig()
		const res = await createShipment(cfg, input)
		return NextResponse.json({ ok: true, status: res.status, data: res.data })
	} catch (error: any) {
		return NextResponse.json({ ok: false, error: error?.message || 'Unknown error' }, { status: 500 })
	}
}



