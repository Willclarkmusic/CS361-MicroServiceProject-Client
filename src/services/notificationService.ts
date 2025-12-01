// Notification Service - Notification operations

import { API_URLS, apiGet, apiPut, apiDelete } from './api';

// Backend notification structure (matches database schema)
interface BackendNotification {
  notificationId: number;
  senderId: number;
  senderAvatarURL: string | null;
  receiverId: number;
  entityId: number;
  type: string;
  message: string;
  isRead: number; // 0 or 1 from SQLite boolean
  createdAt: string;
}

// Frontend notification structure
export interface Notification {
  notificationId: number;
  senderId: string;
  senderAvatarURL: string | null;
  receiverId: string;
  entityId: number;
  type: 'review_liked' | 'review_disliked' | 'friend_request';
  message: string;
  isRead: number; // 0 = unread, 1 = read
  createdAT: string;
}

interface BackendNotificationsResponse {
  data: BackendNotification[];
  message: string;
}

// Transform backend notification to frontend format
const transformNotification = (n: BackendNotification): Notification => ({
  notificationId: n.notificationId,
  senderId: String(n.senderId),
  senderAvatarURL: n.senderAvatarURL,
  receiverId: String(n.receiverId),
  entityId: n.entityId,
  type: n.type as 'review_liked' | 'review_disliked' | 'friend_request',
  message: n.message,
  isRead: n.isRead,
  createdAT: n.createdAt,
});

// Get all notifications for a user
export const getNotifications = async (
  userId: number
): Promise<Notification[]> => {
  const response = await apiGet<BackendNotificationsResponse>(
    `${API_URLS.notifications}/notifications/${userId}`
  );
  return (response.data || []).map(transformNotification);
};

// Mark a notification as read
export const markAsRead = async (
  notificationId: number
): Promise<{ message: string }> => {
  return apiPut<{ message: string }>(
    `${API_URLS.notifications}/read/${notificationId}`
  );
};

// Delete a notification
export const deleteNotification = async (
  notificationId: number
): Promise<{ message: string }> => {
  return apiDelete<{ message: string }>(
    `${API_URLS.notifications}/delete/${notificationId}`
  );
};
