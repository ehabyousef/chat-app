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
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function AppSidebar() {
  const { getUsers, users, setSelectedUser, selectedUser } = useMessageStore();
  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Sidebar>
      <SidebarContent className="bg-background">
        <SidebarGroup className="mt-[65px]">
          <SidebarGroupLabel className="text-xl">Friends</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {users?.map((user) => (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
