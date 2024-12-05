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
import { Eye, Plus, MapPinPlus, MapPin } from "lucide-react";
import useAuthStore from "@/store/authStore";
import AccessRestricted from "@/components/AccessRestricted";
import { useEffect, useState } from "react";
import AssignEnumerator from "@/components/CreateUserForm";
import { UserActionsDropdown } from "@/components/UserActionsDropdown";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import useUserActionsStore from "@/store/userActionsStore";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const hasEnumerators = data && data.length > 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-start sm:justify-between sm:items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => {
                  navigate("/");
                }}
                className="cursor-pointer"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {hasEnumerators && (
          <Button
            onClick={() => navigate("/live-locations")}
            className="flex items-center"
            variant="outline"
            size="sm"
          >
            <MapPin className="mr-2 h-4 w-4" />
            View Live Locations
          </Button>
        )}
      </div>
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
                        {enumerator.active ? (
                          <>
                            <Link
                              to={`/enumerators/${enumerator.id}/geofencing/view`}
                            >
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Link
                              to={`/enumerators/${enumerator.id}/geofencing/edit`}
                            >
                              <Button variant="outline" size="sm">
                                <MapPinPlus className="h-4 w-4 mr-2" />
                                Assign new
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <div>
                              <Button variant="outline" size="sm" disabled>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                            <div>
                              <Button variant="outline" size="sm" disabled>
                                <MapPinPlus className="h-4 w-4 mr-2" />
                                Assign new
                              </Button>
                            </div>
                          </>
                        )}
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
