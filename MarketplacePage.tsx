import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, Star, Heart, Search, Filter } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
}

export function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === "all"
        ? `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/products`
        : `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/products?category=${selectedCategory}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const categories = ["all", "clothing", "accessories", "shoes", "jewelry", "bags"];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#fafafa] mb-2">
                <span className="text-[#d4af37]">Marketplace</span>
              </h1>
              <p className="text-[#a8a8a8]">Discover exclusive fashion pieces</p>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="relative p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#262626] transition-all"
            >
              <ShoppingCart size={24} className="text-[#d4af37]" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#d4af37] text-[#0a0a0a] text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a8a8]" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] placeholder-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${selectedCategory === category
                  ? "bg-[#d4af37] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-[#fafafa] hover:bg-[#262626]"
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-[#d4af37]" />
            <p className="text-[#a8a8a8]">No products found. Check back soon!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card hover className="overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#262626] flex items-center justify-center">
                    <div className="text-6xl">👗</div>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-full hover:scale-110 transition-all"
                    >
                      <Heart
                        size={20}
                        className={wishlist.has(product.id) ? "text-[#d4af37] fill-[#d4af37]" : "text-[#fafafa]"}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[#fafafa] line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-[#d4af37] font-bold">${product.price}</span>
                    </div>

                    <p className="text-sm text-[#a8a8a8] mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(product.rating)
                                ? "text-[#d4af37] fill-[#d4af37]"
                                : "text-[#262626]"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#a8a8a8]">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
