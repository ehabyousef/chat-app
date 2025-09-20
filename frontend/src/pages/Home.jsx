import React, { useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useMessageStore } from "@/store/useMessagesStore";
import MessageBox from "@/components/MessageBox";

function HomeContent() {
  const { users, selectedUser } = useMessageStore();
  const { open } = useSidebar();

  return (
    <>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <MessageBox open={open} selectedUser={selectedUser} />
      </main>
    </>
  );
}

function Home() {
  return (
    <SidebarProvider className="min-h-0">
      <HomeContent />
    </SidebarProvider>
  );
}

export default Home;
