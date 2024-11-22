"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Eye, Edit2, Plus } from "lucide-react";
import useAuthStore from "@/store/authStore";
import AccessRestricted from "@/components/AccessRestricted";
import { useEffect, useState } from "react";
import AssignEnumerator from "@/components/CreateUserForm";
import { UserActionsDropdown } from "@/components/UserActionsDropdown";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import useUserActionsStore from "@/store/userActionsStore";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { isEnumDialogOpen, toggleEnumDialogOpen, setRefetchEnumerators } =
    useUserActionsStore();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["enumerators"],
    queryFn: () => fetchData(`/enumerators/${user?.uid}`),
    enabled: !!user?.uid,
    retry: 1,
    onError: (err) => {
      console.error("Error fetching enumerators:", err);
      if (err.response?.status === 401) {
        setIsSessionExpired(true);
        logout();
      }
    },
  });

  useEffect(() => {
    setRefetchEnumerators(refetch); // Store the refetch function in Zustand
  }, [refetch, setRefetchEnumerators]);

  if (!user) {
    return <AccessRestricted sessionExpired={isSessionExpired} />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">UID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Geo-fencings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActionsDropdown user={user} />
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No enumerators found under your supervision.
                </TableCell>
              </TableRow>
            )}
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5}>
                <Dialog
                  open={isEnumDialogOpen}
                  onOpenChange={toggleEnumDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full text-slate-600" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Select Assignable Enumerators
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AssignEnumerator />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog />
    </div>
  );
}
