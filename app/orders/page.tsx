'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface OrderRow {
  id: string
  status: string
  amount: number
  currency: string | null
  created_at: string
  razorpay_order_id: string | null
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)

  function formatAmount(amount: number, currency?: string | null) {
    const cur = (currency || 'INR').toUpperCase()
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur }).format(amount / 100)
    } catch {
      return `${cur} ${(amount / 100).toFixed(2)}`
    }
  }

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('You need to login to view orders')
          setLoading(false)
          return
        }
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, amount, currency, created_at, razorpay_order_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }
        if (!isMounted) return
        setOrders((data as unknown as OrderRow[]) || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load orders')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
            <div className="h-5 bg-gray-100 rounded w-40" />
            <div className="h-12 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            {error}
            <div className="mt-4">
              <Link href="/login">
                <Button variant="outline">Go to Login</Button>
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-600">You have no orders yet.</p>
            <Link href="/products" className="inline-block mt-4">
              <Button>Shop Products</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-4">Order</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Placed</div>
            </div>
            <ul className="divide-y">
              {orders.map((o) => (
                <li key={o.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm">
                  <div className="col-span-4">
                    <div className="font-mono text-gray-900 truncate" title={o.id}>{o.id}</div>
                    {o.razorpay_order_id ? (
                      <div className="text-xs text-gray-500 truncate" title={o.razorpay_order_id}>RP: {o.razorpay_order_id}</div>
                    ) : null}
                  </div>
                  <div className="col-span-2 font-semibold text-gray-900">
                    {formatAmount(o.amount, o.currency)}
                  </div>
                  <div className="col-span-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs capitalize ${
                      o.status === 'paid' ? 'bg-green-100 text-green-800' :
                      o.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {o.status === 'paid' ? '●' : o.status === 'failed' ? '●' : '●'}
                      {o.status}
                    </span>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    {new Date(o.created_at).toLocaleString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


