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

export function ConfirmationDialog() {
  const {
    actionType,
    isConfirmationDialogOpen,
    handleActionConfirmation,
    closeConfirmationDialog,
  } = useUserActionsStore();

  const [confirmationText, setConfirmationText] = useState("");

  const handleSubmit = () => {
    if (confirmationText.toLowerCase() === "confirm") {
      handleActionConfirmation();
      setConfirmationText("");
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
              : "Remove from Supervision"}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type &quot;confirm&quot; to
            proceed.
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
            disabled={confirmationText.toLowerCase() !== "confirm"}
          >
            {actionType === "deactivate" ? "Deactivate" : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
