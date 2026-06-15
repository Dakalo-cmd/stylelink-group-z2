import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Briefcase, Star, Verified, Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  bio: string;
  skills: string[];
  portfolio: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export function ProfileDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <Card className="p-12 text-center">
          <p className="text-[#a8a8a8] mb-4">Profile not found</p>
          <Button onClick={() => navigate("/profiles")}>Back to Profiles</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/profiles")}
          className="flex items-center gap-2 text-[#a8a8a8] hover:text-[#d4af37] mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Profiles
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Cover Banner */}
          <div className="h-48 bg-gradient-to-r from-[#d4af37]/20 to-[#ffd700]/20 rounded-t-xl" />

          {/* Profile Info */}
          <Card className="p-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center text-5xl font-bold text-[#0a0a0a] shadow-xl">
                {profile.fullName.charAt(0)}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold text-[#fafafa]">
                        {profile.fullName}
                      </h1>
                      {profile.verified && (
                        <Verified size={24} className="text-[#d4af37] fill-[#d4af37]" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[#a8a8a8]">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span className="capitalize">{profile.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/bookings/new?creative=${profile.id}`)}
                    >
                      <Calendar size={18} />
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/messages")}
                    >
                      <MessageCircle size={18} />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(profile.rating)
                            ? "text-[#d4af37] fill-[#d4af37]"
                            : "text-[#262626]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[#fafafa] font-medium">{profile.rating.toFixed(1)}</span>
                  <span className="text-[#a8a8a8]">({profile.reviewCount} reviews)</span>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-[#a8a8a8] mb-6">{profile.bio}</p>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#fafafa] mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg text-sm text-[#d4af37]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Portfolio Section */}
          {profile.portfolio && profile.portfolio.length > 0 && (
            <Card className="p-8 mt-6">
              <h2 className="text-2xl font-bold text-[#fafafa] mb-6">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.portfolio.map((item, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-lg flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    📸
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Reviews Section */}
          <Card className="p-8 mt-6">
            <h2 className="text-2xl font-bold text-[#fafafa] mb-6">Reviews</h2>
            {profile.reviewCount === 0 ? (
              <p className="text-[#a8a8a8] text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center">
                      <span className="text-[#0a0a0a] font-bold">J</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#fafafa]">Jane Doe</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className="text-[#d4af37] fill-[#d4af37]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#a8a8a8]">
                        Amazing work! Highly professional and delivered exceptional results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
