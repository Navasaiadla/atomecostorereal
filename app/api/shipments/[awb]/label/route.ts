import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getDelhiveryConfig, getPackingSlip } from '@/lib/delhivery'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { awb: string } }) {
  const awb = decodeURIComponent(params.awb)
  if (!awb || awb.trim().length === 0) {
    return NextResponse.json({ error: 'awb required' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data: row } = await admin
      .from('shipments')
      .select('awb, label_url')
      .eq('awb', awb)
      .maybeSingle()

    // If we already have a label_url, normalize it and try to use it.
    if (row?.label_url && typeof row.label_url === 'string' && row.label_url.startsWith('http')) {
      const normalized = row.label_url.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim()
      const withZoom = normalized.includes('#') ? normalized : `${normalized}#zoom=page-width`
      // Best-effort validation: if HEAD fails, fall back to regeneration
      try {
        const head = await fetch(normalized, { method: 'HEAD' })
        if (head.ok) {
          // Stream inline so viewer hash works consistently and centers properly
          const pdfRes = await fetch(normalized)
          if (pdfRes.ok) {
            const arr = await pdfRes.arrayBuffer()
            return new NextResponse(arr, {
              status: 200,
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${awb}.pdf"`,
                // Keep location with zoom for viewers that consider it
                'X-Original-Location': withZoom,
              }
            })
          }
          return NextResponse.redirect(withZoom, 302)
        }
      } catch (_e) {
        // ignore and regenerate
      }
    }

    // Otherwise, fetch the label from Delhivery and persist the URL
    const cfg = getDelhiveryConfig()
    const url = new URL(request.url)
    const sizeParam = (url.searchParams.get('size') || 'A4').toUpperCase()
    const allowed = new Set(['A4','A5','4R'])
    const size = allowed.has(sizeParam) ? (sizeParam as 'A4' | 'A5' | '4R') : 'A4'
    // Prefer A4; attempt alternates if needed
    const fetchLabel = async (preferred: 'A4' | 'A5' | '4R') => {
      try {
        const effective = preferred === 'A5' ? 'A4' : preferred
        return await getPackingSlip(cfg, [awb], effective as 'A4' | '4R')
      } catch (_e) {
        return null as any
      }
    }
    let res = await fetchLabel(size as 'A4' | 'A5' | '4R')
    // If we didn't get a usable link, try alternate sizes automatically
    const tryOrder: Array<'A4' | 'A5' | '4R'> = size === 'A4' ? ['A5','4R'] : size === '4R' ? ['A4','A5'] : ['A4','4R']
    const pickFirst = (r: any) => {
      const d: any = r?.data
      return d?.ShipmentData?.[0]?.Shipment?.[0]?.Label?.url
        || (Array.isArray(d?.packages) ? d.packages?.[0]?.pdf_download_link : undefined)
        || d?.url
    }
    let labelUrl: string | undefined
    if (res) labelUrl = pickFirst(res)
    if (!labelUrl) {
      for (const alt of tryOrder) {
        const r = await fetchLabel(alt)
        const u = pickFirst(r)
        if (u) { res = r; labelUrl = u; break }
      }
    }
    // Try multiple known response shapes (if not found via fallback)
    if (!labelUrl) {
      const data: any = res?.data
      labelUrl = data?.ShipmentData?.[0]?.Shipment?.[0]?.Label?.url
        || (Array.isArray(data?.packages) ? data.packages?.[0]?.pdf_download_link : undefined)
        || data?.url
    }

    if (!labelUrl) {
      // Try to extract a PDF URL from an HTML response
      const raw = ((res as any)?.raw?.body as string | undefined)
        || ((res?.data as any)?.text as string | undefined)
        || ''
      if (raw) {
        const pdfMatch = raw.match(/https?:\/\/[^\s'"<>]+\.pdf/)
        if (pdfMatch && pdfMatch[0]) {
          const pdfUrl = pdfMatch[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim()
          const withZoom = pdfUrl.includes('#') ? pdfUrl : `${pdfUrl}#zoom=page-width`
          await admin.from('shipments').update({ label_url: pdfUrl }).eq('awb', awb)
          const pdfRes = await fetch(pdfUrl)
          if (pdfRes.ok) {
            const arr = await pdfRes.arrayBuffer()
            return new NextResponse(arr, {
              status: 200,
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${awb}.pdf"`,
                'X-Original-Location': withZoom,
              }
            })
          }
          return NextResponse.redirect(withZoom, 302)
        }
        if (raw.toLowerCase().includes('<html')) {
          return new NextResponse(raw, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
        }
      }
      return NextResponse.json({ error: 'label_unavailable', provider: res?.data }, { status: 502 })
    }

    // Normalize, persist and redirect
    const normalized = labelUrl.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim()
    const withZoom = normalized.includes('#') ? normalized : `${normalized}#zoom=page-width`
    await admin.from('shipments').update({ label_url: normalized }).eq('awb', awb)
    // Stream inline to keep viewer in our route (hash applies reliably)
    try {
      const pdfRes = await fetch(normalized)
      if (pdfRes.ok) {
        const arr = await pdfRes.arrayBuffer()
        return new NextResponse(arr, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${awb}.pdf"`,
            'X-Original-Location': withZoom,
          }
        })
      }
    } catch (_e) {
      // fall back to redirect
    }
    return NextResponse.redirect(withZoom, 302)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed_to_generate_label' }, { status: 500 })
  }
}


