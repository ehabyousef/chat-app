import { useAuthStore } from "@/store/useAuthStore";
import { Camera, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function Profile() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setselectedImg] = useState(null);
  const [formData, setformData] = useState({
    fullName: authUser.fullName || "",
    email: authUser.email || "",
    profilePic: authUser.profilePic || "",
  });
  console.log("🚀 ~ Profile ~ formData:", formData);
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const baeseImg = reader.result;
      console.log("🚀 ~ handleImageUpload ~ baeseImg:", baeseImg);
      setselectedImg(baeseImg);
      setformData((prev) => ({ ...prev, profilePic: baeseImg }));
    };
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (valid !== true) return;

    // Remove empty fields so backend doesn’t see "" for optional values
    const payload = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    updateProfile({ data: payload, id: authUser._id });
  };

  return (
    <div className="h-screen w-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h3>Profile</h3>
            <p>your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImg ||
                  authUser.profilePic ||
                  "../../public/avatar.jpg"
                }
                loading="lazy"
                alt="Profile"
                className="size-32 rounded-full object-contain border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="fullName"
                  name="fullName"
                  className={`input input-bordered w-full py-2 pl-10`}
                  placeholder="ehab yousef"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  className={`input input-bordered w-full py-2 pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary border-2 rounded-lg w-auto p-2 px-5 cursor-pointer"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <Loader2 className="size-5 animate-spin w-full" />
              ) : (
                "update"
              )}
            </button>
          </form>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
