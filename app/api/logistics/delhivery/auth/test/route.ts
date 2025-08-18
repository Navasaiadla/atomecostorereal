import { NextResponse } from 'next/server'
import { getDelhiveryConfig, delhiveryRequest } from '@/lib/delhivery'

export const runtime = 'nodejs'

export async function GET() {
	try {
		const cfg = getDelhiveryConfig()
		// Use a known endpoint to validate creds and base URL
		const testPin = '110001'
		const res = await delhiveryRequest(cfg, `/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(testPin)}`)
		return NextResponse.json({ ok: res.status >= 200 && res.status < 300, environment: cfg.environment, status: res.status, data: res.data })
	} catch (error: any) {
		return NextResponse.json({ ok: false, error: error?.message || 'Unknown error' }, { status: 500 })
	}
}



