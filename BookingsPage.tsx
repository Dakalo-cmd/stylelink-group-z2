import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Booking {
  id: string;
  clientId: string;
  creativeId: string;
  service: string;
  date: string;
  notes: string;
  price: number;
  status: string;
  createdAt: string;
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { accessToken } = useAuth();

  const creativeId = searchParams.get("creative");

  useEffect(() => {
    if (creativeId) {
      setShowNewBooking(true);
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/bookings`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const createBooking = async () => {
    if (!accessToken || !service || !date || !price) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            creativeId: creativeId || "sample-creative-id",
            service,
            date,
            notes,
            price: parseFloat(price),
          }),
        }
      );

      if (response.ok) {
        setService("");
        setDate("");
        setNotes("");
        setPrice("");
        setShowNewBooking(false);
        fetchBookings();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#fafafa] mb-2">
            <span className="text-[#d4af37]">Bookings</span>
          </h1>
          <p className="text-[#a8a8a8]">Manage your appointments and reservations</p>
        </motion.div>

        <Button
          variant="primary"
          onClick={() => setShowNewBooking(!showNewBooking)}
          className="mb-6"
        >
          {showNewBooking ? "Cancel" : "+ New Booking"}
        </Button>

        {/* New Booking Form */}
        {showNewBooking && (
          <Card glass className="p-6 mb-6">
            <h3 className="text-xl font-bold text-[#fafafa] mb-4">Create New Booking</h3>
            <div className="space-y-4">
              <Input
                label="Service"
                placeholder="e.g., Fashion Photoshoot, Styling Session"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <Input
                label="Date & Time"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                label="Price ($)"
                type="number"
                placeholder="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-[#fafafa] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] placeholder-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  rows={3}
                  placeholder="Any special requests or details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={createBooking}
                disabled={loading || !service || !date || !price}
              >
                {loading ? "Creating..." : "Confirm Booking"}
              </Button>
            </div>
          </Card>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-[#d4af37]" />
              <p className="text-[#a8a8a8]">No bookings yet. Create your first booking!</p>
            </Card>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#fafafa] mb-1">
                        {booking.service}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#a8a8a8]">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{new Date(booking.date).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(booking.status)}
                      <span className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full text-xs text-[#d4af37] capitalize">
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="text-sm text-[#a8a8a8] mb-4">{booking.notes}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#d4af37] font-bold">
                      <DollarSign size={18} />
                      <span>${booking.price}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
