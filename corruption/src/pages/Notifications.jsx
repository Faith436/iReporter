import React from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { Info, CheckCircle, Clock } from "lucide-react";
import { useUsers } from "../contexts/UserContext";

const Notifications = () => {
  const { currentUser } = useUsers();
  const { notifications, loading } = useNotifications();

  if (loading) return <p className="p-4">Loading notifications...</p>;

  // Filter notifications for logged-in user
  const userNotifications = notifications.filter(n => n.user_id === currentUser?.id);

  const IconMap = {
    Info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-600" },
    Resolved: { Icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    Reminder: { Icon: Clock, bg: "bg-yellow-50", color: "text-yellow-600" },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {userNotifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4">
          {userNotifications.map((n) => {
            const { Icon, bg, color } = IconMap[n.type] || { Icon: Info, bg: "bg-gray-50", color: "text-gray-600" };
            return (
              <div key={n.id} className={`p-4 rounded-lg ${bg} border border-opacity-50 ${color.replace("text", "border")}`}>
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-1 ${color} flex-shrink-0`} />
                  <div>
                    <p className={`text-sm font-semibold ${color}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
