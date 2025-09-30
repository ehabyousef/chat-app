import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Bell,
  Check,
  LogOut,
  MessageSquare,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { useNotifcationStore } from "@/store/useNotifcationStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { logout, authUser, searchUsers, usersFollow, searching } =
    useAuthStore();
  const {
    getNotifications,
    notifications,
    respondRequest,
    sentRequests, // Use sentRequests instead of friendRequests
    getSentRequests,
  } = useNotifcationStore();
  
  const { requestFriend } = useNotifcationStore();
  const [query, setquery] = useState("");
  const [open, setopen] = useState(false);
  const debRef = useRef();

  const handleChange = (e) => {
    const val = e.target.value;
    setquery(val);
    setopen(Boolean(val.trim()));
    if (debRef.current) clearTimeout(debRef.current);

    debRef.current = setTimeout(() => {
      if (val.trim()) searchUsers(val.trim());
    }, 300);
  };

  useEffect(() => {
    getNotifications();
    getSentRequests(); // Get sent requests on component mount
  }, [getNotifications, getSentRequests]);

  const handleRespond = (e, requestId, status, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    respondRequest(requestId, status, notificationId);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_accepted":
        return <CheckCircle className="size-4 text-green-500" />;
      case "friend_rejected":
        return <XCircle className="size-4 text-red-500" />;
      case "friend_request":
        return <Bell className="size-4 text-blue-500" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <header
      className="bg-background/95 border-b border-border fixed w-full top-0 z-40 
    backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Chatty</h1>
            </Link>
          </div>
          {authUser && (
            <div className="md:w-sm lg:w-xl relative">
              <Input
                value={query}
                onChange={handleChange}
                type="text"
                placeholder="search by First Name"
              />
              {open && (
                <div className="absolute flex flex-col space-y-2 -bottom-32 w-full h-32 overflow-y-auto bg-muted-foreground text-forground p-2 rounded-lg transition-all duration-200 ease-in-out animate-in slide-in-from-top-2 fade-in-0 scale-in-95">
                  {searching ? (
                    <div className="text-md text-primary p-2">Searching…</div>
                  ) : usersFollow.length === 0 ? (
                    <div className="text-md text-primary p-2">
                      No users found
                    </div>
                  ) : (
                    <>
                      {usersFollow.map((u, index) => (
                        <div
                          key={u._id}
                          className="flex w-full justify-between items-center animate-in slide-in-from-left-1 fade-in-0"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="size-12 rounded-full flex gap-4 flex-1">
                            <img
                              src={u.profilePic}
                              alt="avatar"
                              className="rounded-full"
                            />
                            <p className="mb-0 content-center">{u.fullName}</p>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  requestFriend(u._id);
                                }}
                                variant="secondary"
                                disabled={sentRequests.includes(u._id)} // Disable if already sent
                              >
                                {sentRequests.includes(u._id)
                                  ? "Request Sent"
                                  : "Send Request"}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {sentRequests.includes(u._id)
                                ? "Friend request already sent"
                                : "Send friend request"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-0 lg:gap-2">
            <ThemeToggle />

            {authUser && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <img
                      src={authUser.profilePic}
                      alt="profile"
                      className="h-7 w-7 object-cover rounded-xl"
                    />
                    <span className="hidden sm:inline ml-2">Profile</span>
                  </Link>
                </Button>

                {/* Remove manual state management */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="size-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-80 max-h-96 overflow-y-auto"
                    align="end"
                  >
                    <DropdownMenuLabel className="font-semibold">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <DropdownMenuItem disabled>
                        <div className="text-center w-full text-muted-foreground">
                          No notifications
                        </div>
                      </DropdownMenuItem>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id}>
                          <DropdownMenuItem
                            className="flex flex-col items-start gap-2 p-3 cursor-default"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <img
                                src={
                                  notif.senderId?.profilePic || "/avatar.jpg"
                                }
                                alt="sender"
                                className="size-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {notif.senderId?.fullName || "Unknown User"}
                                  </p>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <p className="text-xs text-muted-foreground break-words">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(
                                    notif.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Only show buttons for pending friend requests */}
                            {notif.type === "friend_request" && (
                              <div className="flex gap-2 w-full justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 px-3 cursor-pointer"
                                  onClick={(e) =>
                                    handleRespond(
                                      e,
                                      notif.data?.friendRequestId,
                                      "accepted",
                                      notif._id
                                    )
                                  }
                                >
                                  <Check className="size-3 text-background mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 px-3 cursor-pointer"
                                  onClick={(e) =>
                                    handleRespond(
                                      e,
                                      notif.data?.friendRequestId,
                                      "rejected",
                                      notif._id
                                    )
                                  }
                                >
                                  <X className="size-3 text-background mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {/* Show status for accepted/rejected */}
                            {notif.type === "friend_accepted" && (
                              <div className="w-full text-center">
                                <span className="text-xs text-green-600 font-medium">
                                  ✓ Request Accepted
                                </span>
                              </div>
                            )}

                            {notif.type === "friend_rejected" && (
                              <div className="w-full text-center">
                                <span className="text-xs text-red-600 font-medium">
                                  ✗ Request Rejected
                                </span>
                              </div>
                            )}
                          </DropdownMenuItem>
                          {notifications.indexOf(notif) <
                            notifications.length - 1 && (
                            <DropdownMenuSeparator />
                          )}
                        </div>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
