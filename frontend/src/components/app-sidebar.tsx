import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMessageStore } from "@/store/useMessagesStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export function AppSidebar() {
  const { getFriends, users, setSelectedUser, selectedUser } =
    useMessageStore();
  const { onlineUsers } = useAuthStore();
  const [showOnline, setshowOnline] = useState(false);
  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filterUsers = showOnline
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  return (
    <Sidebar>
      <SidebarContent className="bg-background">
        <SidebarGroup className="mt-[65px]">
          <SidebarGroupLabel className="text-xl">Friends</SidebarGroupLabel>
          <SidebarGroupLabel className="flex items-center space-x-2">
            <Checkbox
              id="online"
              checked={showOnline}
              onCheckedChange={(checked) => setshowOnline(checked === true)}
            />
            <Label htmlFor="online">online friends</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterUsers?.map((user) => (
                <SidebarMenuItem key={user.fullName}>
                  <SidebarMenuButton
                    className="flex justify-between items-center gap-3 h-18"
                    isActive={selectedUser?.fullName === user.fullName}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  >
                    <div className="w-1/2 h-full relative">
                      <img
                        src={user?.profilePic}
                        alt="avatar"
                        className="object-cover h-full w-1/2 rounded-xl"
                      />
                      {onlineUsers.includes(user._id) && (
                        <div className="-bottom-1 -left-1 absolute size-3 rounded-full bg-chart-2" />
                      )}
                    </div>
                    <span className="text-primary fw-bold text-lg">
                      {user.fullName}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {filterUsers.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  no users to show
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
