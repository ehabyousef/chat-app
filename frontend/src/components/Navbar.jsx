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
    sentRequests,
    getSentRequests,
  } = useNotifcationStore();

  const { requestFriend, markNotificationRead } = useNotifcationStore();
  const [query, setquery] = useState("");
  const [open, setopen] = useState(false);
  const debRef = useRef();

  // Reset query when user logs out or component mounts
  useEffect(() => {
    if (!authUser) {
      setquery("");
      setopen(false);
    }
  }, [authUser]);

  // Only fetch data when user is authenticated
  useEffect(() => {
    if (authUser) {
      getNotifications();
      getSentRequests();
    }
  }, [getNotifications, getSentRequests, authUser]);

  const handleChange = (e) => {
    const val = e.target.value;
    setquery(val);
    setopen(Boolean(val.trim()));
    if (debRef.current) clearTimeout(debRef.current);

    debRef.current = setTimeout(() => {
      if (val.trim()) searchUsers(val.trim());
    }, 300);
  };

  // Clear search when clicking outside or when input loses focus
  const handleBlur = () => {
    setTimeout(() => {
      setopen(false);
    }, 200); // Small delay to allow clicks on search results
  };

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
                // onBlur={handleBlur}
                type="text"
                placeholder="search by First Name"
              />
              {open && (
                <div className="absolute top-full mt-2 w-full max-h-80 overflow-y-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0 scale-in-95 z-50">
                  {searching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm font-medium">
                          Searching users...
                        </span>
                      </div>
                    </div>
                  ) : usersFollow.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <div className="text-muted-foreground/60 mb-2">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        No users found
                      </span>
                      <span className="text-xs text-muted-foreground/60 mt-1">
                        Try a different search term
                      </span>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-muted-foreground/80 px-3 py-2 border-b border-border/30">
                        Search Results ({usersFollow.length})
                      </div>
                      <div className="space-y-1 mt-2">
                        {usersFollow.map((u, index) => (
                          <div
                            key={u._id}
                            className="group flex w-full justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-in slide-in-from-left-1 fade-in-0 border border-transparent hover:border-border/30"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="relative">
                                <img
                                  src={u.profilePic}
                                  alt="avatar"
                                  className="size-10 rounded-full object-cover ring-2 ring-background shadow-sm group-hover:ring-primary/20 transition-all duration-200"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                                  {u.fullName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  @{u.email?.split("@")[0] || "user"}
                                </p>
                              </div>
                            </div>

                            <Button
                              onClick={() => {
                                requestFriend(u._id);
                              }}
                              variant={
                                sentRequests.includes(u._id)
                                  ? "outline"
                                  : "default"
                              }
                              size="sm"
                              disabled={sentRequests.includes(u._id)}
                              className={`
                                ml-3 shrink-0 transition-all duration-200 shadow-sm
                                ${
                                  sentRequests.includes(u._id)
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                    : "hover:shadow-md hover:scale-105"
                                }
                              `}
                            >
                              {sentRequests.includes(u._id) ? (
                                <>
                                  <svg
                                    className="w-3 h-3 mr-1.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Sent
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-3 h-3 mr-1.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  Add Friend
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
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
                            <div
                              onClick={() => markNotificationRead(notif._id)}
                              className="flex items-start gap-3 w-full cursor-pointer"
                            >
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
