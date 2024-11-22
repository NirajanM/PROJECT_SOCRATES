import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useUserActionsStore = create(
  devtools((set, get) => ({
    selectedUser: null,
    actionType: null,
    isConfirmationDialogOpen: false,
    enumerators: [],
    assignEnumeratorLoading: false,

    // Set the selected user and action type for confirmation dialog
    setUserActionSelection: (user, actionType) => {
      set({ selectedUser: user, actionType, isConfirmationDialogOpen: true });
    },

    // Handle confirmation of action (e.g., deactivate or remove)
    handleActionConfirmation: async () => {
      const { selectedUser, actionType } = get();

      if (!selectedUser || !actionType) return;

      // Handle action (e.g., deactivate or remove)
      try {
        if (actionType === "deactivate") {
          console.log(`Deactivating user: ${selectedUser.name}`);
          // Add logic for deactivating user
        } else if (actionType === "remove") {
          console.log(`Removing user: ${selectedUser.name}`);
          // Add logic for removing from supervision
        }

        // Reset state after action
        set({
          selectedUser: null,
          actionType: null,
          isConfirmationDialogOpen: false,
        });
      } catch (error) {
        console.error("Action failed:", error);
      }
    },

    // Handle closing the confirmation dialog
    closeConfirmationDialog: () => {
      set({ isConfirmationDialogOpen: false });
    },
  }))
);

export default useUserActionsStore;
