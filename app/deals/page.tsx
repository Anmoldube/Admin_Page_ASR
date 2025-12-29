"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api"

interface Deal {
  id: string
  from: string
  to: string
  date: string
  time: string
  aircraft: string
  price: number
  image: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      const mockDeals: Deal[] = [
        {
          id: "1",
          from: "Bangalore",
          to: "Mumbai",
          date: "15 Nov 2024",
          time: "10:30 AM",
          aircraft: "Legacy 600",
          price: 110000,
          image: "/jet-deals.png",
        },
        {
          id: "2",
          from: "Delhi",
          to: "Goa",
          date: "18 Nov 2024",
          time: "2:15 PM",
          aircraft: "Citation X",
          price: 95000,
          image: "/jet-deals.png",
        },
        {
          id: "3",
          from: "Chennai",
          to: "Hyderabad",
          date: "20 Nov 2024",
          time: "6:45 PM",
          aircraft: "Falcon 900",
          price: 85000,
          image: "/jet-deals.png",
        },
      ]

      try {
        const response = await apiGet<any>(`/api/deals?active=true&limit=100`)
        if (!response.success || !response.data) {
          setDeals(mockDeals)
          return
        }
        const data = response.data
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []

        const normalized: Deal[] = (items as any[]).map((d: any, idx: number) => {
          const dateStr = d.date ? new Date(d.date) : null
          const displayDate = dateStr
            ? dateStr.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
            : ""
          return {
            id: String(d._id ?? d.id ?? idx + 1),
            from: d.from ?? "",
            to: d.to ?? "",
            date: displayDate,
            time: d.time ?? "",
            aircraft: d.aircraft ?? "",
            price: Number(d.price ?? 0),
            image: d.image ?? "/jet-deals.png",
          }
        }).filter(d => d.from && d.to)

        setDeals(normalized.length > 0 ? normalized : mockDeals)
      } catch (e) {
        console.error("Failed to load deals:", e)
        setDeals(mockDeals)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">All Deals</h1>
        <p className="text-gray-600 mb-10">Browse all current offers and empty legs available right now.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-600">Please check back later for new offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img src={deal.image || "/placeholder.svg"} alt={`${deal.aircraft} - ${deal.from} to ${deal.to}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="font-semibold text-gray-900">{deal.from}</p>
                    </div>
                    <div className="w-10 h-px bg-gray-300" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">To</p>
                      <p className="font-semibold text-gray-900">{deal.to}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p>{deal.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p>{deal.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Aircraft</p>
                      <p>{deal.aircraft}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-xl font-bold text-gray-900">₹{deal.price.toLocaleString()}</p>
                    </div>
                    <a href={`/contact?subject=charter&message=${encodeURIComponent(`Interested in booking ${deal.aircraft} from ${deal.from} to ${deal.to} on ${deal.date}${deal.time ? ' at ' + deal.time : ''}. Quoted price: ₹${deal.price.toLocaleString()}.`)}`}>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">Book Now</button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
