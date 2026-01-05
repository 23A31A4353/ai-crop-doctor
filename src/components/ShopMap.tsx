import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Language } from '@/lib/languages';
import { mockShops, Shop } from '@/lib/marketplace';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShopMapProps {
  language: Language;
  onClose: () => void;
}

export const ShopMap = ({ language, onClose }: ShopMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const t = getTranslations(language);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (err) {
        console.error('Failed to fetch Mapbox token:', err);
        toast.error(language.code === 'hi' ? 'मैप लोड करने में त्रुटि' : 'Error loading map');
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [language.code]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Center on Andhra Pradesh
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.6480, 16.5062], // Vijayawada, AP
      zoom: 7,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each shop
    mockShops.forEach((shop) => {
      const el = document.createElement('div');
      el.className = 'shop-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `;
      
      el.addEventListener('click', () => {
        setSelectedShop(shop);
        map.current?.flyTo({
          center: [shop.longitude, shop.latitude],
          zoom: 14,
        });
      });

      new mapboxgl.Marker(el)
        .setLngLat([shop.longitude, shop.latitude])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const getLocalizedText = (en: string, hi: string) => {
    return language.code === 'hi' ? hi : en;
  };

  const openDirections = (shop: Shop) => {
    const destination = `${shop.latitude},${shop.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
    toast.success(language.code === 'hi' ? 'Google Maps में दिशा-निर्देश खुल रहे हैं...' : 'Opening directions in Google Maps...');
  };

  const callShop = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t.storeLocator}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          {language.code === 'hi' ? 'मैप उपलब्ध नहीं है' : 'Map not available'}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.storeLocator}</h2>
            <p className="text-sm text-muted-foreground">{t.findNearbyShops}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <div ref={mapContainer} className="w-full h-[400px]" />
        
        {selectedShop && (
          <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{getLocalizedText(selectedShop.name, selectedShop.nameHindi)}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {selectedShop.rating}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedShop.isOpen ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {selectedShop.isOpen ? t.open : t.closed}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedShop(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {getLocalizedText(selectedShop.address, selectedShop.addressHindi)}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => callShop(selectedShop.phone)}>
                <Phone className="w-4 h-4 mr-1" />
                {t.call}
              </Button>
              <Button size="sm" className="flex-1" onClick={() => openDirections(selectedShop)}>
                <Navigation className="w-4 h-4 mr-1" />
                {t.directions}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Shop list below map */}
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground">{t.allShops}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {mockShops.map((shop) => (
            <div
              key={shop.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedShop?.id === shop.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedShop(shop);
                map.current?.flyTo({
                  center: [shop.longitude, shop.latitude],
                  zoom: 14,
                });
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{getLocalizedText(shop.name, shop.nameHindi)}</span>
                <span className="text-xs text-muted-foreground">{getLocalizedText(shop.distance, shop.distanceHindi)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};