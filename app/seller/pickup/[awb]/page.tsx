import Link from "next/link"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

interface DayOption { key: string; label: string }
interface SlotOption { key: string; label: string }

function getUpcomingDays(): DayOption[] {
  const days: DayOption[] = []
  const now = new Date()
  // Limit to today + next 2 days (total 3)
  for (let i = 0; i < 3; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
    days.push({ key, label })
  }
  return days
}

const SLOT_OPTIONS: SlotOption[] = [
  { key: 'mid_day', label: 'Mid Day (10:00 - 14:00)' },
  { key: 'evening', label: 'Evening (14:00 - 18:00)' },
  { key: 'late_evening', label: 'Late Evening (18:00 - 21:00)' },
]

export default async function PickupPage({ params }: { params: { awb: string } }) {
  const awb = decodeURIComponent(params.awb)
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const days = getUpcomingDays()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Schedule Pickup</span>
            <span className="text-sm text-gray-500">AWB: {awb}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={`/api/shipments/${encodeURIComponent(awb)}/pickup`} method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <div className="grid grid-cols-3 gap-2">
                {days.map(d => (
                  <label key={d.key} className="border rounded-md p-2 flex items-center gap-2 hover:bg-gray-50">
                    <input type="radio" name="pickup_date" value={d.key} className="h-4 w-4" defaultChecked={d.key === days[0].key} />
                    <span className="text-sm">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Slot</label>
              <select name="pickup_slot" className="w-full border rounded-md p-2 text-sm">
                {SLOT_OPTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Link href="/seller/orders" className="px-3 py-1.5 rounded-md text-sm border hover:bg-gray-50">Cancel</Link>
              <Button type="submit">Add to Pickup</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


