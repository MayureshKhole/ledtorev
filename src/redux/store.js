import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
  },
});

export default store;
