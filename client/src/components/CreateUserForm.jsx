"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useAuthStore from "../store/authStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchData, patchData } from "@/utils/api";

export default function AssignEnumerator({ onClose }) {
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch assignable enumerators
  const {
    data: enumerators,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ["assignableEnumerators"],
    queryFn: () => fetchData("/assignable-enumerators"),
  });

  // Assign enumerator mutation
  const { mutate: assignEnumerator, isLoading: isAssigning } = useMutation({
    mutationFn: (enumeratorId) =>
      patchData(`/assign-enumerator/${enumeratorId}`),
    onSuccess: () => {
      alert("Enumerator assigned successfully!");
      onClose(); // Close dialog on success
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to assign enumerator.");
    },
  });

  // Handle assignment action
  const handleAssign = (enumeratorId) => {
    if (!user) {
      setErrorMessage(
        "You must be logged in as a supervisor to assign an enumerator."
      );
      return;
    }
    assignEnumerator(enumeratorId);
  };

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError.message || "Failed to fetch enumerators.");
    }
  }, [fetchError]);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Assignable Enumerators</DialogTitle>
      </DialogHeader>
      {isFetching ? (
        <p>Loading enumerators...</p>
      ) : enumerators?.length ? (
        <ul>
          {enumerators.map((enumerator) => (
            <li
              key={enumerator.id}
              className="flex justify-between items-center"
            >
              <p>
                {enumerator.name} - {enumerator.email}
              </p>
              <Button
                onClick={() => handleAssign(enumerator.id)}
                disabled={isAssigning}
              >
                {isAssigning ? "Assigning..." : "Select this User"}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignable enumerators found.</p>
      )}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
