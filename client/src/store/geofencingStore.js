import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useGeofencingStore = create(
  devtools((set, get) => ({
    geofencing: null,
    setGeofencing: (data) => set({ geofencing: data }),
    updateEnumeratorGeofencing: () => null,
  }))
);

export default useGeofencingStore;
