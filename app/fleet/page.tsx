'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type FleetCategory = 'charter' | 'taxi' | 'air-ambulance';
interface FleetItem {
  _id?: string;
  id?: string;
  name: string;
  model?: string;
  capacity?: number;
  range?: string;
  speed?: string;
  image?: string;
  images?: {
    outside?: string;
    inside?: string;
    seats?: string;
    extra?: string;
  };
  description?: string;
  features?: string[];
  pricePerHour?: number;
  category?: FleetCategory;
}

export default function FleetPage() {
  const [fleets, setFleets] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FleetItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | FleetCategory>('all');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [charterRes, taxiRes, ambulanceRes] = await Promise.all([
          fetch('/api/fleet/charter', { cache: 'no-store' }),
          fetch('/api/fleet/taxi', { cache: 'no-store' }),
          fetch('/api/fleet/air-ambulance', { cache: 'no-store' }),
        ]);
        if (!charterRes.ok && !taxiRes.ok && !ambulanceRes.ok) {
          throw new Error('Failed to load any fleet category');
        }
        const [charter, taxi, ambulance] = await Promise.all([
          charterRes.ok ? charterRes.json() : [],
          taxiRes.ok ? taxiRes.json() : [],
          ambulanceRes.ok ? ambulanceRes.json() : [],
        ]);
        if (!ignore) {
          const normalize = (arr: any[], category: FleetCategory): FleetItem[] =>
            (Array.isArray(arr) ? arr : []).map((x) => ({ ...x, category }));
          setFleets([
            ...normalize(charter, 'charter'),
            ...normalize(taxi, 'taxi'),
            ...normalize(ambulance, 'air-ambulance'),
          ]);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || 'Failed to load fleet');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true };
  }, []);

  const visible = useMemo(() => {
    if (activeTab === 'all') return fleets;
    return fleets.filter(f => f.category === activeTab);
  }, [fleets, activeTab]);

  const hasData = visible && visible.length > 0;

  const grid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {visible.map((f) => {
        const key = String(f._id ?? f.id ?? Math.random());
        const price = typeof f.pricePerHour === 'number' ? `₹${f.pricePerHour.toLocaleString()}/hr` : undefined;
        return (
          <Card
            key={key}
            className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => setSelected(f)}
          >
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <Carousel className="w-full h-full" autoPlay autoPlayInterval={4000}>
                <CarouselContent className="h-48">
                  {(() => {
                    const imgs = Array.from(new Set([
                      f.images?.outside,
                      f.images?.inside,
                      f.images?.seats,
                      f.images?.extra,
                      f.image,
                    ].filter(Boolean) as string[]));
                    const listBase = imgs.length > 0 ? imgs : ['/placeholder.jpg'];
                    const list = listBase.length === 1 ? [listBase[0], listBase[0]] : listBase;
                    return list.map((src, idx) => (
                      <CarouselItem key={idx} className="h-48">
                        <img src={src} alt={`${f.name} ${idx+1}`} className="w-full h-full object-cover" />
                      </CarouselItem>
                    ));
                  })()}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
              </Carousel>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const id = String(f._id ?? f.id ?? 'x');
                  setFavorites((prev) => {
                    const next = new Set(prev);
                    next.has(id) ? next.delete(id) : next.add(id);
                    return next;
                  });
                }}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart size={20} className={favorites.has(String(f._id ?? f.id ?? 'x')) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{f.name}</h3>
              {f.model && <p className="text-sm text-gray-600 mb-4">{f.model}</p>}

              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DAA520]">{f.capacity ?? '-'}</p>
                  <p className="text-xs text-gray-600">Capacity</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DAA520]">{f.range ?? '-'}</p>
                  <p className="text-xs text-gray-600">Range</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DAA520]">{f.speed ?? '-'}</p>
                  <p className="text-xs text-gray-600">Speed</p>
                </div>
              </div>

              {f.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{f.description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{price ?? 'Price on request'}</span>
                <Button onClick={() => setSelected(f)} className="bg-[#DAA520] hover:bg-[#c99416] text-white">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  ), [visible, favorites]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-black/10 to-white">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our Premium <span className="text-[#DAA520]">Fleet</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience luxury aviation with our carefully curated selection of modern aircraft.
            From light jets to ultra-long-range aircraft, we have the perfect plane for your journey.
          </p>
        </div>
      </div>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { key: 'all', label: 'All' },
              { key: 'charter', label: 'Charter' },
              { key: 'taxi', label: 'Air Taxi' },
              { key: 'air-ambulance', label: 'Air Ambulance' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`px-5 py-2 rounded-full border ${activeTab === t.key ? 'bg-[#DAA520] border-[#DAA520] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600" />
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to load fleet</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          {!loading && !error && !hasData && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No fleet available right now</h3>
              <p className="text-gray-600">Please check back later.</p>
            </div>
          )}
          {!loading && !error && hasData && grid}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <Card className="max-w-2xl w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{selected.name}</h2>
                  {selected.model && <p className="text-gray-600">{selected.model}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="text-2xl text-gray-400 hover:text-gray-600" aria-label="Close">×</button>
              </div>

             {/* Images Carousel */}
             <div className="mb-6">
               <Carousel className="w-full" autoPlay autoPlayInterval={4000}>
                 <CarouselContent className="h-64">
                   {(() => {
                     const imgs = Array.from(new Set([
                       selected.images?.outside,
                       selected.images?.inside,
                       selected.images?.seats,
                       selected.images?.extra,
                       selected.image,
                     ].filter(Boolean) as string[]));
                     const listBase = imgs.length > 0 ? imgs : ['/placeholder.jpg'];
                     const list = listBase.length === 1 ? [listBase[0], listBase[0]] : listBase;
                     return list.map((src, idx) => (
                       <CarouselItem key={idx} className="h-64">
                         <img src={src} alt={`${selected.name} ${idx+1}`} className="w-full h-full object-cover rounded-lg" />
                       </CarouselItem>
                     ));
                   })()}
                 </CarouselContent>
                 <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                 <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
               </Carousel>
             </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Passenger Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{selected.capacity ?? '-'} Seats</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Maximum Range</p>
                  <p className="text-2xl font-bold text-gray-900">{selected.range ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Maximum Speed</p>
                  <p className="text-2xl font-bold text-gray-900">{selected.speed ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price Per Hour</p>
                  <p className="text-2xl font-bold text-[#DAA520]">{typeof selected.pricePerHour === 'number' ? `₹${selected.pricePerHour.toLocaleString()}/hr` : 'On request'}</p>
                </div>
              </div>

              {selected.features && selected.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {selected.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#DAA520] rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={`/contact?subject=charter&message=${encodeURIComponent(`Interested in ${selected.name}${selected.model ? ' (' + selected.model + ')' : ''}. Capacity: ${selected.capacity ?? '-'} seats. Range: ${selected.range ?? '-'}; Speed: ${selected.speed ?? '-'}. Price: ${typeof selected.pricePerHour === 'number' ? '₹' + selected.pricePerHour.toLocaleString() + '/hr' : 'On request'}.`)}`}
              >
                <Button className="w-full bg-[#DAA520] hover:bg-[#c99416] text-white py-6 text-lg">
                  Request Charter for {selected.name}
                </Button>
              </a>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
