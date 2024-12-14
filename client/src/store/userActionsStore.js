import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useUserActionsStore = create(
  devtools((set, get) => ({
    selectedUser: null,
    actionType: null,
    isConfirmationDialogOpen: false,
    enumerators: [],
    assignEnumeratorLoading: false,
    isEnumDialogOpen: false,
    // refetchEnumerators: null,

    // setRefetchEnumerators: (refetchFn) =>
    //   set({ refetchEnumerators: refetchFn }),

    // triggerRefetchEnumerators: () => {
    //   const refetch = get().refetchEnumerators;
    //   if (refetch) {
    //     refetch();
    //   } else {
    //     console.warn("Refetch function is not set yet.");
    //   }
    // },

    // Set the selected user and action type for confirmation dialog
    setUserActionSelection: (user, actionType) => {
      set({ selectedUser: user, actionType, isConfirmationDialogOpen: true });
    },

    // Handle closing the confirmation dialog
    closeConfirmationDialog: () => {
      set({ isConfirmationDialogOpen: false });
    },

    closeEnumDialog: () => {
      set({ isEnumDialogOpen: false });
    },

    openEnumDialog: () => {
      set({ isEnumDialogOpen: true });
    },

    toggleEnumDialogOpen: () => {
      set({ isEnumDialogOpen: !get().isEnumDialogOpen });
    },
  }))
);

export default useUserActionsStore;
