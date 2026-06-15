import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CreditCard, Lock, Trash2, CheckCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { projectId } from "../../../utils/supabase/info";

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Designer Jacket", price: 350, quantity: 1 },
    { id: "2", name: "Luxury Handbag", price: 850, quantity: 1 },
  ]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [promoCode, setPromoCode] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 20;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!accessToken) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            items: cartItems,
            total,
            shippingAddress,
            paymentMethod,
          }),
        }
      );

      if (response.ok) {
        setOrderComplete(true);
        setTimeout(() => navigate("/marketplace"), 3000);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-[#0a0a0a]" />
          </div>
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">Order Complete!</h1>
          <p className="text-[#a8a8a8] mb-6">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <Button variant="primary" onClick={() => navigate("/marketplace")}>
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#fafafa] mb-2">
            <span className="text-[#d4af37]">Checkout</span>
          </h1>
          <p className="text-[#a8a8a8]">Complete your purchase securely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shopping Cart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#fafafa] mb-4">Shopping Cart</h2>
              {cartItems.length === 0 ? (
                <p className="text-[#a8a8a8] py-8 text-center">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-lg flex items-center justify-center">
                        👗
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#fafafa]">{item.name}</h3>
                        <p className="text-[#d4af37] font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-[#262626] rounded-lg text-[#fafafa] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[#fafafa]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-[#262626] rounded-lg text-[#fafafa] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#fafafa] mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                />
                <Input
                  label="Address"
                  placeholder="123 Fashion Street"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                />
                <Input
                  label="City"
                  placeholder="New York"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                />
                <Input
                  label="ZIP Code"
                  placeholder="10001"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                />
                <Input
                  label="Country"
                  placeholder="United States"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className="md:col-span-2"
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#fafafa] mb-4 flex items-center gap-2">
                <Lock size={20} className="text-[#d4af37]" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {["stripe", "paypal", "payfast", "card"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${paymentMethod === method
                        ? "border-[#d4af37] bg-[#d4af37]/10"
                        : "border-[#d4af37]/20 bg-[#1a1a1a] hover:bg-[#262626]"
                      }
                    `}
                  >
                    <CreditCard className="mx-auto mb-2 text-[#d4af37]" size={24} />
                    <p className="text-sm font-medium text-[#fafafa] capitalize">{method}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#a8a8a8] flex items-center gap-2">
                <Lock size={12} />
                Your payment information is secure and encrypted
              </p>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card glass className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#fafafa] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#a8a8a8]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#a8a8a8]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#a8a8a8]">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-[#d4af37]/20" />
                <div className="flex justify-between text-xl font-bold text-[#fafafa]">
                  <span>Total</span>
                  <span className="text-[#d4af37]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>

              {shipping > 0 && (
                <p className="text-xs text-[#a8a8a8] text-center mt-4">
                  Free shipping on orders over $500
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
