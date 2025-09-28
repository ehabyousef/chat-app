import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useMessageStore } from "./useMessagesStore";

const BASE_URL = "http://localhost:5001";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  islogingin: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  usersFollow: [],
  searching: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("cant check", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("user created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ islogingin: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("logged in successfully", {
        icon: "👏",
      });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ islogingin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async ({ data, id }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put(`/users/update-profile/${id}`, data);
      set({ authUser: res.data });
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  searchUsers: async (search) => {
    try {
      set({ searching: true });
      const res = await axiosInstance.get(`/users/appUsers`, {
        params: { search },
      });
      set({ usersFollow: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ searching: false });
    }
  },

  addFriend: async (id) => {
    try {
      await axiosInstance.put(`/users/addFriend`, { friendId: id });
      toast.success("added to friends");
      const { getFriends } = useMessageStore.getState();
      getFriends();

      set((state) => ({
        usersFollow: state.usersFollow.filter((x) => x._id !== id),
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
