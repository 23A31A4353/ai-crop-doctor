import { useState } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { 
  mockShops, 
  mockProducts, 
  productCategories, 
  getProductsByCategory, 
  getShopById,
  Product,
  Shop 
} from '@/lib/marketplace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTranslations } from '@/lib/translations';
import { 
  Store, 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ShoppingCart,
  Navigation,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketplaceProps {
  language: Language;
  crop: Crop;
}

type ViewMode = 'shops' | 'products';

export const Marketplace = ({ language, crop }: MarketplaceProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const t = getTranslations(language);

  const products = getProductsByCategory(selectedCategory).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameHindi.includes(searchQuery)
  );

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const getCartQuantity = (productId: string) => {
    return cart.find(item => item.productId === productId)?.quantity || 0;
  };

  const openDirections = (shop: Shop) => {
    // Open Google Maps with directions
    const address = encodeURIComponent(shop.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(mapsUrl, '_blank');
    toast.success(language.code === 'hi' ? 'मैप खुल रहा है...' : 'Opening map...');
  };

  const callShop = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getLocalizedText = (en: string, hi: string) => {
    return language.code === 'hi' ? hi : en;
  };

  const renderShopCard = (shop: Shop) => (
    <div key={shop.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{getLocalizedText(shop.name, shop.nameHindi)}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {shop.rating}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          shop.isOpen 
            ? 'bg-primary/20 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {shop.isOpen ? t.open : t.closed}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {getLocalizedText(shop.address, shop.addressHindi)} • {getLocalizedText(shop.distance, shop.distanceHindi)}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {shop.openTime} - {shop.closeTime}
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => callShop(shop.phone)}
        >
          <Phone className="w-4 h-4 mr-1" />
          {t.call}
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => openDirections(shop)}
        >
          <Navigation className="w-4 h-4 mr-1" />
          {t.directions}
        </Button>
      </div>
    </div>
  );

  const renderProductCard = (product: Product) => {
    const shop = getShopById(product.shopId);
    const cartQty = getCartQuantity(product.id);

    return (
      <div key={product.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{product.image}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{getLocalizedText(product.name, product.nameHindi)}</h3>
            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {getLocalizedText(product.description, product.descriptionHindi)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-lg font-bold text-primary">₹{product.price}</div>
            <div className="text-xs text-muted-foreground">
              {getLocalizedText(product.unit, product.unitHindi)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="w-3 h-3" />
                {t.inStock}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <X className="w-3 h-3" />
                {t.outOfStock}
              </span>
            )}
          </div>
        </div>

        {shop && (
          <div 
            className="flex items-center gap-2 mt-3 text-xs text-muted-foreground cursor-pointer hover:text-primary"
            onClick={() => openDirections(shop)}
          >
            <Store className="w-3 h-3" />
            {getLocalizedText(shop.name, shop.nameHindi)} • {getLocalizedText(shop.distance, shop.distanceHindi)}
            <Navigation className="w-3 h-3 ml-auto" />
          </div>
        )}

        <Button 
          size="sm" 
          className="w-full mt-3"
          disabled={!product.inStock}
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {cartQty > 0 ? `${t.added} (${cartQty})` : t.addToCart}
        </Button>
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20">
          <Store className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{t.marketplace}</h2>
          <p className="text-sm text-muted-foreground">{t.marketSubtitle}</p>
        </div>
        {cart.length > 0 && (
          <Button size="sm" variant="outline" className="relative">
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </Button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'products' ? 'default' : 'outline'}
          onClick={() => setViewMode('products')}
          className="flex-1"
        >
          🛒 {t.products}
        </Button>
        <Button
          variant={viewMode === 'shops' ? 'default' : 'outline'}
          onClick={() => setViewMode('shops')}
          className="flex-1"
        >
          🏪 {t.shops}
        </Button>
      </div>

      {viewMode === 'products' && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {productCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0"
              >
                {cat.icon} <span className="ml-1">{getLocalizedText(cat.name, cat.nameHindi)}</span>
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(renderProductCard)}
          </div>
        </>
      )}

      {viewMode === 'shops' && (
        <div className="space-y-4">
          {mockShops.map(renderShopCard)}
        </div>
      )}
    </div>
  );
};
