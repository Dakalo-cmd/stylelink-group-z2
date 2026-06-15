import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Star, MapPin, Verified, Briefcase } from "lucide-react";
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
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [selectedRole]);

  const fetchProfiles = async () => {
    try {
      const url = selectedRole === "all"
        ? `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/users`
        : `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/users?role=${selectedRole}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      const data = await response.json();
      setProfiles(data.users || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const roles = ["all", "designer", "stylist", "model", "photographer", "client"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#fafafa] mb-2">
            Discover <span className="text-[#d4af37]">Creatives</span>
          </h1>
          <p className="text-[#a8a8a8]">
            Connect with top fashion professionals
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`
                px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${selectedRole === role
                  ? "bg-[#d4af37] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-[#fafafa] hover:bg-[#262626]"
                }
              `}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
          </div>
        ) : profiles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-[#a8a8a8]">No profiles found. Be the first to create one!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card hover className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a0a0a]">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#fafafa]">
                          {profile.fullName}
                        </h3>
                        {profile.verified && (
                          <Verified size={16} className="text-[#d4af37] fill-[#d4af37]" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#a8a8a8]">
                        <Briefcase size={14} />
                        <span className="capitalize">{profile.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm text-[#a8a8a8] mb-4 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full text-xs text-[#d4af37]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(profile.rating)
                              ? "text-[#d4af37] fill-[#d4af37]"
                              : "text-[#262626]"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#a8a8a8]">
                      ({profile.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/bookings/new?creative=${profile.id}`)}
                    >
                      Book Now
                    </Button>
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
