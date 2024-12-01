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
import { Eye, Plus, MapPinPlus } from "lucide-react";
import useAuthStore from "@/store/authStore";
import AccessRestricted from "@/components/AccessRestricted";
import { useEffect, useState } from "react";
import AssignEnumerator from "@/components/CreateUserForm";
import { UserActionsDropdown } from "@/components/UserActionsDropdown";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import useUserActionsStore from "@/store/userActionsStore";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="overflow-x-auto py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">UID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Geo-fencings Data</TableHead>
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
              : data?.map((enumerator) => (
                  <TableRow key={enumerator.id}>
                    <TableCell
                      className={
                        !enumerator.active ? "opacity-50" : "font-medium"
                      }
                    >
                      {enumerator.id}
                    </TableCell>
                    <TableCell className={!enumerator.active && "opacity-50"}>
                      {enumerator.name}
                    </TableCell>
                    <TableCell className={!enumerator.active && "opacity-50"}>
                      {enumerator.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/enumerators/${enumerator.id}/geofencing/view`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!enumerator.active}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link
                          to={`/enumerators/${enumerator.id}/geofencing/edit`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!enumerator.active}
                          >
                            <MapPinPlus className="h-4 w-4 mr-2" />
                            Assign new
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActionsDropdown user={enumerator} />
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
