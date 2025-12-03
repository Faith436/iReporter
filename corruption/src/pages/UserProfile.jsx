import React, { useState, useEffect } from "react";
import { useUsers } from "../contexts/UserContext";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { currentUser, updateUserProfile, changePassword } = useUsers();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  // --- Populate profile safely, converting "undefined" strings to empty ---
  useEffect(() => {
    if (currentUser) {
      setProfile({
        firstName:
          currentUser.firstName && currentUser.firstName !== "undefined"
            ? currentUser.firstName
            : "",
        lastName:
          currentUser.lastName && currentUser.lastName !== "undefined"
            ? currentUser.lastName
            : "",
        email: currentUser.email || "",
        bio:
          currentUser.bio && currentUser.bio !== "undefined"
            ? currentUser.bio
            : "",
        phone:
          currentUser.phone && currentUser.phone !== "undefined"
            ? currentUser.phone
            : "",
        avatar:
          currentUser.avatar && currentUser.avatar !== "undefined"
            ? currentUser.avatar
            : "",
      });
      setAvatarPreview(
        currentUser.avatar && currentUser.avatar !== "undefined"
          ? currentUser.avatar
          : ""
      );
      setDarkMode(currentUser.prefersDark || false);
    }
  }, [currentUser]);

  // --- Handle input changes ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- Submit profile, only sending valid values ---
  // --- Submit profile: ALWAYS send what user typed ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // ALWAYS send the input values (even empty strings)
      formData.append("firstName", profile.firstName || "");
      formData.append("lastName", profile.lastName || "");
      formData.append("bio", profile.bio || "");
      formData.append("phone", profile.phone || "");

      // Only add avatar if a real File was selected
      if (profile.avatar instanceof File) {
        formData.append("avatar", profile.avatar);
      }

      await updateUserProfile(formData);
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

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          My Profile
        </h1>

        {/* Dark/Light Mode */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDarkModeToggle}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                No Image
              </div>
            )}
          </div>
          <label className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
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
        <form onSubmit={handleProfileSubmit} className="space-y-5 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Tell us a little about yourself..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Save Profile
          </button>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Change Password
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
