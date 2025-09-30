import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useMessageStore } from "./useMessagesStore";
import { useAuthStore } from "./useAuthStore";

export const useNotifcationStore = create((set, get) => ({
  notifications: [],
  friendRequests: [],
  sentRequests: [], // Add this to track sent requests

  requestFriend: async (friendId) => {
    try {
      const res = await axiosInstance.post("/notifications/FriendRequest", {
        friendId,
      });

      // Add to sent requests list
      set((state) => ({
        sentRequests: [...state.sentRequests, friendId],
      }));

      // Remove from search results
      const { usersFollow } = useAuthStore.getState();
      useAuthStore.setState({
        usersFollow: usersFollow.filter((x) => x._id !== friendId),
      });

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  respondRequest: async (requestId, status, notificationId) => {
    try {
      const res = await axiosInstance.post("/notifications/respond", {
        requestId,
        status,
        notificationId,
      });

      set((state) => ({
        friendRequests: state.friendRequests.filter((x) => x._id !== requestId),
      }));

      toast.success(res.data.message);

      // If accepted, refresh friends list
      if (status === "accepted") {
        const { getFriends } = useMessageStore.getState();
        getFriends();
      }

      // Fix: Call getNotifications correctly
      get().getNotifications();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getFriendsRequests: async () => {
    try {
      const res = await axiosInstance.get("/notifications/FriendRequests");
      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    }
  },

  getNotifications: async () => {
    try {
      const res = await axiosInstance.get(`/notifications`);
      set({ notifications: res.data });
    } catch (error) {
      console.error("Get notifications error:", error);
    }
  },

  // Add function to check if request was sent
  getSentRequests: async () => {
    try {
      const res = await axiosInstance.get("/notifications/sent-requests");
      set({ sentRequests: res.data.map((req) => req.receiverId) });
    } catch (error) {
      console.error("Get sent requests error:", error);
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/markRead`);

      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ),
      }));
    } catch (error) {
      toast.error(
        error.response.data.message || "Failed to mark notification as read"
      );
    }
  },
}));
