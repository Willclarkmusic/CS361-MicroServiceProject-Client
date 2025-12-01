import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiThumbsUp, FiThumbsDown, FiUsers, FiCheck, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import * as notificationService from "../../services/notificationService";
import type { Notification } from "../../services/notificationService";

const NotificationsDropdown = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.isRead === 0).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user || !isOpen) return;

      setLoading(true);
      try {
        const data = await notificationService.getNotifications(user.userId);
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen, isAuthenticated, user]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const pollNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(user.userId);
        setNotifications(data);
      } catch (err) {
        console.error("Error polling notifications:", err);
      }
    };

    // Initial fetch
    pollNotifications();

    // Set up polling interval
    const interval = setInterval(pollNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: 1 } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "review_liked":
        return <FiThumbsUp size={16} className="text-green-500" />;
      case "review_disliked":
        return <FiThumbsDown size={16} className="text-red-500" />;
      case "friend_request":
        return <FiUsers size={16} className="text-blue-500" />;
      default:
        return <FiBell size={16} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
        aria-label="Notifications"
      >
        <FiBell size={20} className="text-[var(--text-primary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center border border-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-3 border-b-2 border-[var(--border-color)] flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-sm text-[var(--text-secondary)]">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent animate-spin mx-auto"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-3 border-b border-[var(--border-color)] last:border-b-0 ${
                    notification.isRead === 0 ? "bg-[var(--bg-secondary)]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Sender Avatar */}
                    <Link to={`/user/${notification.senderId}`}>
                      <img
                        src={
                          notification.senderAvatarURL ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="User"
                        className="w-10 h-10 border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatTime(notification.createdAT)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {notification.isRead === 0 && (
                        <button
                          onClick={() => handleMarkAsRead(notification.notificationId)}
                          className="p-1 hover:bg-[var(--accent-primary)] hover:text-black transition-all"
                          title="Mark as read"
                        >
                          <FiCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.notificationId)}
                        className="p-1 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-[var(--text-secondary)]">
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
