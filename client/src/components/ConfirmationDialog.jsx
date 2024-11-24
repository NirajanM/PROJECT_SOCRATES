import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUserActionsStore from "@/store/userActionsStore";
import { useMutation } from "@tanstack/react-query";
import { patchData } from "@/utils/api";

export function ConfirmationDialog() {
  const {
    selectedUser,
    actionType,
    isConfirmationDialogOpen,
    closeConfirmationDialog,
    triggerRefetchEnumerators,
  } = useUserActionsStore();

  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmTextValid =
    confirmationText.trim().toLowerCase() === "confirm";

  // Common onSuccess handler for both actions
  const handleSuccess = (message) => {
    closeConfirmationDialog();
    setConfirmationText("");
    triggerRefetchEnumerators();
  };

  const activateUserMutation = useMutation({
    mutationFn: () => patchData(`/activate-enumerator/${selectedUser.id}`),
    onSuccess: () =>
      handleSuccess(`User ${selectedUser.name} activated successfully.`),
    onError: (error) => {
      console.error("Activation failed:", error);
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: () => patchData(`/deactivate-enumerator/${selectedUser.id}`),
    onSuccess: () =>
      handleSuccess(`User ${selectedUser.name} deactivated successfully.`),
    onError: (error) => {
      console.error("Deactivation failed:", error);
    },
  });

  const removeSupervisionMutation = useMutation({
    mutationFn: () => patchData(`/remove-supervision/${selectedUser.id}`),
    onSuccess: () =>
      handleSuccess(`Supervision removed for user ${selectedUser.name}.`),
    onError: (error) => {
      console.error("Supervision removal failed:", error);
    },
  });

  const handleActionConfirm = () => {
    if (!selectedUser || !actionType) return;

    if (actionType === "deactivate") {
      deactivateUserMutation.mutate();
    } else if (actionType === "activate") {
      activateUserMutation.mutate();
    } else if (actionType === "remove") {
      removeSupervisionMutation.mutate();
    }
  };

  const handleSubmit = () => {
    if (isConfirmTextValid) {
      handleActionConfirm();
    }
  };

  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={closeConfirmationDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "deactivate"
              ? "Deactivate User"
              : actionType === "activate"
              ? "Activate User"
              : "Remove from Supervision"}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type <strong>confirm</strong>{" "}
            to proceed.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Type 'confirm' here"
        />
        <DialogFooter>
          <Button variant="outline" onClick={closeConfirmationDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !isConfirmTextValid ||
              deactivateUserMutation.isLoading ||
              removeSupervisionMutation.isLoading
            }
          >
            {deactivateUserMutation.isLoading ||
            removeSupervisionMutation.isLoading
              ? "Processing..."
              : actionType === "deactivate"
              ? "Deactivate"
              : actionType === "activate"
              ? "Activate"
              : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
