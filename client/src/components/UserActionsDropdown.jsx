import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserActionsStore from "@/store/userActionsStore";
import { MoreVertical, UserCog, UserMinus } from "lucide-react";

export function UserActionsDropdown({ user }) {
  const { setUserActionSelection } = useUserActionsStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => {
            setUserActionSelection(user, "deactivate");
          }}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Deactivate User</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            setUserActionSelection(user, "remove");
          }}
        >
          <UserCog className="mr-2 h-4 w-4" />
          <span>Remove from Supervision</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
