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
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Edit2,
  MoreVertical,
  UserCog,
  UserMinus,
  Shield,
  LogIn,
  UserPlus,
  Plus,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const Users = useQuery({
    queryKey: ["Users"],
    queryFn: () => fetchData(`/users`),
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] md:p-4">
        <Card className="w-full max-w-[450px] mx-auto">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need to be logged in to view this content.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              You cannot have enumerators under you as a guest. Please login or
              sign up as a supervisor to continue.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => navigate("/login")} className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
            {Users.isLoading
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
              : Users.data?.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.uid}</TableCell>
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
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5}>
                <Button
                  onClick={() => {
                    /* Add logic to create new user */
                  }}
                  className="w-full text-slate-600"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New User
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
