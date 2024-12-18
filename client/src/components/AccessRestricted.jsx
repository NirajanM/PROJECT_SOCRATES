import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessRestricted({ sessionExpired = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] md:p-4">
      <Card className="w-full max-w-[450px] mx-auto">
        <CardHeader>
          <CardTitle>
            {sessionExpired ? "Session Expired" : "Access Restricted"}
          </CardTitle>
          <CardDescription>
            {sessionExpired
              ? "Your session has expired. Please log in again to continue."
              : "You need to be logged in to view this content."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {sessionExpired ? (
            <p className="text-sm text-muted-foreground">
              Please log in again to regain access.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              You cannot have enumerators under you as a guest. Please log in or
              sign up as a supervisor to continue.
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => navigate("/login")} className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
            {!sessionExpired && (
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
