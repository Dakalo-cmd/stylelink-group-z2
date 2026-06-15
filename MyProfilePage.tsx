import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Camera } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { projectId } from "../../../utils/supabase/info";
import { toast } from "sonner";

export function MyProfilePage() {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: "",
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id || !accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/users/${user.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      if (data.profile) {
        setFormData({
          fullName: data.profile.fullName || "",
          bio: data.profile.bio || "",
          skills: data.profile.skills || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !accessToken) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea7dcd64/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast("Profile updated successfully!");
      } else {
        toast("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#fafafa] mb-2">
            My <span className="text-[#d4af37]">Profile</span>
          </h1>
          <p className="text-[#a8a8a8]">Manage your professional profile</p>
        </motion.div>

        <Card className="p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center text-5xl font-bold text-[#0a0a0a]">
                {user.fullName.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center hover:bg-[#ffd700] transition-all">
                <Camera size={18} className="text-[#0a0a0a]" />
              </button>
            </div>
            <p className="text-sm text-[#a8a8a8] mt-3 capitalize">{user.role}</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Your full name"
            />

            <div>
              <label className="block text-sm font-medium text-[#fafafa] mb-2">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg text-[#fafafa] placeholder-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                rows={4}
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-[#fafafa] mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button variant="primary" onClick={addSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg text-sm text-[#d4af37] flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-[#d4af37] hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
