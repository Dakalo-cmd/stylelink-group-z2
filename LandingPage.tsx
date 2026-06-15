import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Users, Calendar, MessageCircle, ShoppingBag, Star, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Connect with Creatives",
      description: "Network with designers, stylists, models, and photographers",
    },
    {
      icon: Calendar,
      title: "Seamless Bookings",
      description: "Schedule services with real-time availability",
    },
    {
      icon: MessageCircle,
      title: "Direct Messaging",
      description: "Communicate instantly with fashion professionals",
    },
    {
      icon: ShoppingBag,
      title: "Luxury Marketplace",
      description: "Shop exclusive fashion pieces from local creators",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#ffd700]/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="text-[#d4af37]" size={24} />
              <span className="text-[#d4af37] font-medium">Welcome to the Future of Fashion</span>
              <Sparkles className="text-[#d4af37]" size={24} />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-[#fafafa]">Style</span>
              <span className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text text-transparent">
                Link
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#a8a8a8] mb-8 max-w-3xl mx-auto">
              The luxury fashion networking platform connecting designers, stylists, models,
              photographers, and clients in one elegant ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/profiles")}
              >
                Explore Creatives
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-[#a8a8a8]">
              <div className="flex items-center gap-2">
                <Star className="text-[#d4af37] fill-[#d4af37]" size={16} />
                <span>Premium Quality</span>
              </div>
              <div className="h-4 w-px bg-[#d4af37]/20" />
              <div className="flex items-center gap-2">
                <Star className="text-[#d4af37] fill-[#d4af37]" size={16} />
                <span>Verified Professionals</span>
              </div>
              <div className="h-4 w-px bg-[#d4af37]/20" />
              <div className="flex items-center gap-2">
                <Star className="text-[#d4af37] fill-[#d4af37]" size={16} />
                <span>Secure Platform</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#141414]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
              Everything You Need in <span className="text-[#d4af37]">One Platform</span>
            </h2>
            <p className="text-[#a8a8a8] text-lg">
              Built for the modern fashion industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glass className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={28} className="text-[#0a0a0a]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#fafafa] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#a8a8a8]">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card glass className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
                Ready to <span className="text-[#d4af37]">Elevate</span> Your Fashion Network?
              </h2>
              <p className="text-[#a8a8a8] text-lg mb-8">
                Join StyleLink today and connect with the best in the industry
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Create Your Account
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d4af37]/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-lg flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text text-transparent">
              StyleLink
            </span>
          </div>
          <p className="text-[#a8a8a8] text-sm">
            © 2026 StyleLink. All rights reserved. Built with luxury and precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
