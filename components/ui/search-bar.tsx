import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  small?: boolean
  variant?: 'default' | 'dark'
}

export function SearchBar({ small, variant = 'default' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; title: string }>>([])

  useEffect(() => {
    const handle = setTimeout(async () => {
      const q = query.trim()
      if (q.length < 2) {
        setResults([])
        return
      }
      try {
        setLoading(true)
        const params = new URLSearchParams({ search: q, limit: '5' })
        const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) return
        const data = await res.json()
        setResults((data.products || []).slice(0, 5).map((p: any) => ({ id: p.id, title: p.title })))
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [query])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/products?search=${encodeURIComponent(q)}`)
  }

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search for eco-friendly products..."
          className={`w-full ${small ? 'pl-3 pr-8 py-2 text-sm' : 'pl-4 pr-12 py-2'} rounded-lg border border-gray-200 focus:outline-hidden focus:border-blue-700`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-white ${small ? 'px-3 py-1 text-sm' : 'px-4 py-1'} rounded ${
            variant === 'dark'
              ? 'bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400'
              : 'bg-sky-400 hover:bg-sky-500 focus:ring-2 focus:ring-sky-300'
          }`}
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
      {query.trim().length > 1 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="px-3 py-2 text-sm text-gray-600">Product not available</div>
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <a href={`/products/${p.id}`} className="block px-3 py-2 hover:bg-gray-50 text-sm text-gray-800">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


