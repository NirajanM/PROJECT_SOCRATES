import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserPlus } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchData, patchData } from "@/utils/api";
import useUserActionsStore from "@/store/userActionsStore";
import { useToast } from "@/hooks/use-toast";

export default function AssignEnumerator() {
  const { user } = useAuthStore();
  const { closeEnumDialog, triggerRefetchEnumerators } = useUserActionsStore();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const {
    data: enumerators,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ["assignableEnumerators"],
    queryFn: () => fetchData("/assignable-enumerators"),
  });

  const { mutate: assignEnumerator, isLoading: isAssigning } = useMutation({
    mutationFn: ({ enumeratorId, supervisorId }) =>
      patchData(`/assign-enumerator/${enumeratorId}`, { supervisorId }), // Send supervisorId with enumeratorId
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Enumerator assigned successfully!",
        variant: "default",
      });
      closeEnumDialog();
      triggerRefetchEnumerators();
    },
    onError: (error) => {
      const message = error.message || "Failed to assign enumerator.";
      setErrorMessage(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleAssign = (enumeratorId) => {
    if (!user) {
      setErrorMessage(
        "You must be logged in as a supervisor to assign an enumerator."
      );
      return;
    }
    assignEnumerator({ enumeratorId, supervisorId: user.uid }); // Pass supervisor's UID here
  };

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError.message || "Failed to fetch enumerators.");
    }
  }, [fetchError]);

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          Assignable Enumerators List
        </DialogTitle>
      </DialogHeader>

      {isFetching ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : enumerators?.length ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {enumerators.map((enumerator) => (
              <Card key={enumerator.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={enumerator.avatar}
                        alt={enumerator.name}
                      />
                      <AvatarFallback>
                        {enumerator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{enumerator.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {enumerator.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAssign(enumerator.id)}
                    disabled={isAssigning}
                    size="sm"
                  >
                    {isAssigning ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No assignable enumerators found.
        </div>
      )}

      {errorMessage && (
        <p className="text-sm text-destructive mt-2">{errorMessage}</p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={closeEnumDialog}>
          Cancel
        </Button>
      </DialogFooter>
    </div>
  );
}
