import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

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

export function AppSidebar() {
  const { getUsers, users, setSelectedUser, selectedUser } = useMessageStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Sidebar>
      <SidebarContent>
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
                    <div className="w-1/2 h-full">
                      <img
                        src={user?.profilePic}
                        className="object-cover h-full w-1/2 rounded-xl"
                      />
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
