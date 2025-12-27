import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axiosInstance";

export const useAuthAdminStore = create((set) => ({
  authAdmin: null,
  isSigningIn: false,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: async (data: any) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/admins/login", data);
      localStorage.setItem("accessToken", res.data.access_token);
      set({ authAdmin: res.data });

      toast.success("Admin login successfully!");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      toast.error(error.response.data.error);
    } finally {
      set({ isSigningIn: false });
    }
  },
}));
