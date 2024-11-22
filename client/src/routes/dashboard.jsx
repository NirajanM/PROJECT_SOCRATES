import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Edit2,
  MoreVertical,
  UserCog,
  UserMinus,
  Shield,
  Plus,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import AccessRestricted from "@/components/AccessRestricted";
import { useState } from "react";
import CreateUserForm from "@/components/CreateUserForm";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const { data, isLoading, isError } = useQuery({
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Edit User Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Change Permissions</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserMinus className="mr-2 h-4 w-4" />
                            <span>Deactivate User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                  open={isCreateUserOpen}
                  onOpenChange={setIsCreateUserOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full text-slate-600" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Select Free Enumerators
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <CreateUserForm
                      onClose={() => setIsCreateUserOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
