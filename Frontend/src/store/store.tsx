import { createUserSlice, userinfo } from "./userinfo";
import { create } from "zustand";

type AppState = userinfo;

export const useStore = create<AppState>()((...args) => ({
  ...createUserSlice(...args),
}));
