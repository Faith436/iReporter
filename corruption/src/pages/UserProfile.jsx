import React, { useState, useEffect } from "react";
import { useUsers } from "../contexts/UserContext";
import toast from "react-hot-toast";

// Icons for a modern look (assuming you have a library like react-icons)
import { FiUser, FiLock, FiMoon, FiSun, FiUpload } from "react-icons/fi";

const UserProfile = () => {
  const { currentUser, updateUserProfile, changePassword } = useUsers();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
    avatar: null, // File object if user selects new avatar
  });
  const [avatarPreview, setAvatarPreview] = useState(""); // always a URL string
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  // --- Populate profile safely ---
  useEffect(() => {
    if (currentUser) {
      setProfile({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        phone: currentUser.phone || "",
        avatar: null, // do not prefill file input
      });
      setAvatarPreview(currentUser.avatar || ""); // display existing avatar
      setDarkMode(currentUser.prefersDark || false);
    }
  }, [currentUser]);

  // --- Handle text input changes ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle avatar file selection ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- Submit profile updates ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("bio", profile.bio);
      formData.append("phone", profile.phone);

      if (profile.avatar instanceof File) {
        formData.append("avatar", profile.avatar);
      }

      const res = await updateUserProfile(formData);

      console.log("Profile updated:", res);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile");
    }
  };

  // --- Handle password changes ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Failed to change password");
    }
  };

  // --- Toggle dark mode ---
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  // Tailwind Class Updates
  const inputClass =
    "mt-1 block w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 transition duration-150 ease-in-out";
  const disabledInputClass =
    "mt-1 block w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed";
  const labelClass =
    "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1";
  const cardClass =
    "bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800";
  const primaryButtonClass =
    "w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md hover:shadow-lg";
  const secondaryButtonClass =
    "px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition";

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-950" : "bg-gray-500"
      }`}
    >
      <div className="w-full">
        {/* Header and Settings */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <button
            onClick={handleDarkModeToggle}
            className={secondaryButtonClass}
          >
            {darkMode ? (
              <FiMoon className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Profile Card & Avatar */}
        <div className={`${cardClass} mb-8`}>
          <h2 className="text-2xl font-semibold text-gray-400 dark:text-white mb-6 flex items-center">
            <FiUser className="w-6 h-6 mr-2 text-indigo-600" />
            Personal Information
          </h2>

          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500 dark:border-indigo-400 shadow-xl">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <label className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition font-medium text-sm shadow-md">
                <FiUpload className="inline w-4 h-4 mr-1" />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={handleProfileSubmit}
              className="flex-grow space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email (Read-Only)</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className={disabledInputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows={3}
                  className={inputClass}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <button type="submit" className={primaryButtonClass}>
                Save Profile Updates
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className={cardClass}>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiLock className="w-6 h-6 mr-2 text-green-600" />
            Security Settings
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field) => (
                  <div key={field}>
                    <label className={labelClass}>
                      {field === "currentPassword"
                        ? "Current Password"
                        : field === "newPassword"
                        ? "New Password"
                        : "Confirm New Password"}
                    </label>
                    <input
                      type="password"
                      name={field}
                      value={passwords[field]}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                )
              )}
            </div>

            <button
              type="submit"
              // Updated to a success/security color (green) and full width
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition font-bold shadow-md hover:shadow-lg"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
