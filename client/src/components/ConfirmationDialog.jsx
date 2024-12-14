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
import { patchData } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ConfirmationDialog() {
  const {
    selectedUser,
    actionType,
    isConfirmationDialogOpen,
    closeConfirmationDialog,
  } = useUserActionsStore();

  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmTextValid =
    confirmationText.trim().toLowerCase() === "confirm";

  const { toast } = useToast();
  const queryClient = useQueryClient(); // React Query client for managing queries

  const handleSuccess = (message) => {
    closeConfirmationDialog();
    setConfirmationText("");
    toast({
      title: "Successful",
      description: message,
    });
    // Invalidate all queries related to enumerators
    queryClient.invalidateQueries(["enumerators"]);
    queryClient.invalidateQueries(["geofencing"]);
  };

  const actionConfig = {
    deactivate: {
      mutationFn: () => patchData(`/deactivate-enumerator/${selectedUser.id}`),
      successMessage: `User deactivated successfully.`,
    },
    activate: {
      mutationFn: () => patchData(`/activate-enumerator/${selectedUser.id}`),
      successMessage: `User activated successfully.`,
    },
    remove: {
      mutationFn: () => patchData(`/remove-supervision/${selectedUser.id}`),
      successMessage: `User removed successfully.`,
    },
    delete_geo: {
      mutationFn: () => patchData(`/remove-geofence/${selectedUser}`),
      successMessage: `Geofence deleted successfully.`,
    },
  };

  const mutation = useMutation({
    mutationFn: actionConfig[actionType]?.mutationFn,
    onSuccess: () => handleSuccess(actionConfig[actionType]?.successMessage),
    onError: (error) => {
      console.error(`${actionType} action failed:`, error);
      toast({
        title: "Error",
        description: `Failed to perform action: ${error.message || "Unknown"}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (isConfirmTextValid && actionConfig[actionType]) {
      mutation.mutate();
    }
  };

  const dialogTitleMap = {
    deactivate: "Deactivate User",
    activate: "Activate User",
    remove: "Remove from Supervision",
    delete_geo: "Remove Geofence",
  };

  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={closeConfirmationDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitleMap[actionType]}</DialogTitle>
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
            disabled={!isConfirmTextValid || mutation.isLoading}
          >
            {mutation.isLoading
              ? "Processing..."
              : dialogTitleMap[actionType]?.split(" ")[0]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
