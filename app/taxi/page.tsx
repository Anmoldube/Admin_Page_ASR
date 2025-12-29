'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TaxiItem {
  id: string;
  name: string;
  model: string;
  capacity: number;
  range: string;
  speed: string;
  pricePerHour: number;
  features: string[];
  description?: string;
  image?: string;
  status?: 'available' | 'maintenance' | 'booked';
}

export default function TaxiPage() {
  const [items, setItems] = useState<TaxiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<TaxiItem | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    pickup: '',
    destination: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/fleet/taxi');
        if (!res.ok) throw new Error(`Failed to load taxi fleet (${res.status})`);
        const data = await res.json();
        const normalized: TaxiItem[] = (Array.isArray(data) ? data : []).map((d: any) => ({
          id: String(d._id || d.id),
          name: d.name || 'Air Taxi',
          model: d.model || '',
          capacity: Number(d.capacity || 0),
          range: String(d.range || ''),
          speed: String(d.speed || ''),
          pricePerHour: Number(d.pricePerHour || 0),
          features: Array.isArray(d.features) ? d.features : [],
          description: d.description || '',
          image: d.image || '/jet-deals.png',
          status: d.status || 'available',
        }));
        if (!cancelled) {
          setItems(normalized);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const currency = useMemo(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }), []);

  const handleBooking = async () => {
    if (!selected) return;
    try {
      const payload = {
        userId: 'mock-user-id',
        flightId: `taxi-${selected.id}`,
        passengers: 1,
        totalPrice: selected.pricePerHour || 0,
        specialRequests: `Air Taxi booking for ${selected.name} (${selected.model}) on ${bookingForm.date} ${bookingForm.time} from ${bookingForm.pickup} to ${bookingForm.destination}. Contact: ${bookingForm.name}, ${bookingForm.email}, ${bookingForm.phone}`,
      };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Booking failed (${res.status})`);
      }
      // In mock mode, backend returns a created booking
      setSelected(null);
      setBookingForm({ name: '', email: '', phone: '', date: '', time: '', pickup: '', destination: '' });
      alert('Booking request submitted! Our team will contact you shortly.');
    } catch (err: any) {
      alert(err?.message || 'Failed to submit booking');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-black/10 to-white">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Air <span className="text-[#DAA520]">Taxi</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our Air Taxi fleet and request a booking instantly.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(loading ? Array.from({ length: 6 }) : items).map((service: any, idx: number) => (
              <Card key={service?.id || idx} className="overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#DAA520]/20 to-gray-200 overflow-hidden">
                  {loading ? (
                    <div className="w-full h-full animate-pulse bg-gray-200" />
                  ) : (
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {loading ? <span className="inline-block w-40 h-6 bg-gray-200 animate-pulse rounded" /> : service.name}
                      </h3>
                      <p className="text-sm text-[#DAA520] font-medium">
                        {loading ? <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded" /> : service.model}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 py-3 border-y">
                    <div>
                      <p className="text-2xl font-bold text-[#DAA520]">{loading ? '-' : service.capacity}</p>
                      <p className="text-xs text-gray-600">Capacity</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">
                        {loading ? '-' : `${currency.format(service.pricePerHour)}/hr`}
                      </p>
                      <p className="text-xs text-gray-600">Starting rate</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {loading ? <span className="inline-block w-full h-4 bg-gray-200 animate-pulse rounded" /> : (service.description || 'Premium air taxi service for your travel needs.')}
                  </p>

                  <Button
                    disabled={loading}
                    onClick={() => !loading && setSelected(service)}
                    className="w-full bg-[#DAA520] hover:bg-[#c99416] text-white"
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setSelected(null)}>
          <Card className="max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Book {selected.name}</h2>
                  <p className="text-gray-600">{selected.model}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="space-y-4 mb-6">
                <input type="text" name="name" placeholder="Your Name" value={bookingForm.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="email" name="email" placeholder="Email Address" value={bookingForm.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="tel" name="phone" placeholder="Phone Number" value={bookingForm.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="date" name="date" value={bookingForm.date} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="time" name="time" value={bookingForm.time} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="text" name="pickup" placeholder="Pickup Location" value={bookingForm.pickup} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
                <input type="text" name="destination" placeholder="Destination" value={bookingForm.destination} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520]" />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setSelected(null)} className="flex-1 border border-gray-300 text-gray-900 hover:bg-gray-50">Cancel</Button>
                <Button onClick={handleBooking} className="flex-1 bg-[#DAA520] hover:bg-[#c99416] text-white">Confirm Booking - {currency.format(selected.pricePerHour)}/hr</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
