import { useState, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { getTranslations } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  X,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  shop_id: string;
  shop_name: string;
  status: string;
  total_amount: number;
  items: { name: string; quantity: number; price: number }[];
  created_at: string;
  estimated_delivery: string | null;
  delivery_address: string | null;
}

interface OrderFromDB {
  id: string;
  shop_id: string;
  shop_name: string;
  status: string;
  total_amount: number;
  items: unknown;
  created_at: string;
  estimated_delivery: string | null;
  delivery_address: string | null;
}

interface OrderTrackingProps {
  language: Language;
  onClose: () => void;
}

const statusSteps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export const OrderTracking = ({ language, onClose }: OrderTrackingProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const t = getTranslations(language);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Order interface
      const transformedOrders: Order[] = (data || []).map((order: OrderFromDB) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items as { name: string; quantity: number; price: number }[] : []
      }));
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; hi: string }> = {
      pending: { en: 'Order Placed', hi: 'ऑर्डर दिया गया' },
      confirmed: { en: 'Confirmed', hi: 'पुष्टि हुई' },
      preparing: { en: 'Preparing', hi: 'तैयारी जारी' },
      out_for_delivery: { en: 'Out for Delivery', hi: 'डिलीवरी के लिए निकला' },
      delivered: { en: 'Delivered', hi: 'डिलीवर हो गया' },
    };
    return language.code === 'hi' ? labels[status]?.hi : labels[status]?.en;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <Package className="w-5 h-5" />;
      case 'preparing':
        return <ShoppingBag className="w-5 h-5" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {language.code === 'hi' ? 'ऑर्डर देखने के लिए लॉगिन करें' : 'Please login to view orders'}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.orderTracking}</h2>
            <p className="text-sm text-muted-foreground">{t.trackYourOrders}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-semibold mb-2">
            {language.code === 'hi' ? 'कोई ऑर्डर नहीं' : 'No orders yet'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {language.code === 'hi' 
              ? 'जब आप कुछ खरीदेंगे तो यहाँ दिखाई देगा'
              : 'Your orders will appear here when you make a purchase'}
          </p>
        </div>
      ) : selectedOrder ? (
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
            ← {language.code === 'hi' ? 'वापस जाएं' : 'Back to orders'}
          </Button>

          {/* Order Header */}
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {language.code === 'hi' ? 'ऑर्डर आईडी' : 'Order ID'}
              </span>
              <span className="font-mono text-sm">{selectedOrder.id.slice(0, 8)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedOrder.shop_name}</span>
              <span className="font-bold text-primary">₹{selectedOrder.total_amount}</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            {statusSteps.map((step, index) => {
              const currentIndex = getStatusIndex(selectedOrder.status);
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={step} className="relative flex items-center gap-4 py-3">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                    {getStatusIcon(step)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {getStatusLabel(step)}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary">
                        {language.code === 'hi' ? 'वर्तमान स्थिति' : 'Current status'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-semibold">{language.code === 'hi' ? 'आइटम' : 'Items'}</h4>
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {selectedOrder.delivery_address && (
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{selectedOrder.delivery_address}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                  }`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-medium">{order.shop_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  order.status === 'delivered' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {getStatusLabel(order.status)}
                </span>
                <span className="font-bold">₹{order.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};