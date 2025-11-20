import React from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { Info, CheckCircle, Clock, X, Trash2 } from "lucide-react";
import { useUsers } from "../contexts/UserContext";
import toast, { Toaster } from "react-hot-toast";

const Notifications = () => {
  const { currentUser } = useUsers();
  const { notifications, loading, deleteNotification, deleteAllNotifications } = useNotifications();

  if (loading) return <p className="p-4 text-gray-500">Loading notifications...</p>;

  // Admin sees all notifications, users see only their own
  const userNotifications =
    currentUser?.role === "admin"
      ? notifications
      : notifications.filter((n) => n.user_id === currentUser?.id);

  const IconMap = {
    Info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-600" },
    Resolved: { Icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    Reminder: { Icon: Clock, bg: "bg-yellow-50", color: "text-yellow-600" },
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await deleteAllNotifications();
      toast.success("All notifications deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete all notifications");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {currentUser?.role === "admin" && userNotifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition font-semibold text-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete All
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {userNotifications.map((n) => {
            const { Icon, bg, color } =
              IconMap[n.type] || { Icon: Info, bg: "bg-gray-50", color: "text-gray-600" };

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl ${bg} border border-opacity-50 ${color.replace(
                  "text",
                  "border"
                )} flex justify-between items-start shadow-sm hover:shadow-md transition duration-200`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-1 ${color} flex-shrink-0`} />
                  <div>
                    <p className={`text-sm font-semibold ${color}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Delete individual */}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition transform hover:scale-110"
                  title="Delete Notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
