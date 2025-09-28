import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRef, useState } from "react";

const Navbar = () => {
  const { logout, authUser, searchUsers, usersFollow, searching, addFriend } =
    useAuthStore();
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
          <div className="md:w-sm lg:w-xl relative">
            <Input
              value={query}
              onChange={handleChange}
              type="text"
              placeholder="search by First Name"
            />
            {open && (
              <div className="absolute flex flex-col space-y-2 -bottom-32 w-full h-32 overflow-y-auto bg-muted-foreground text-forground p-2 rounded-lg">
                {searching ? (
                  <div className="text-sm text-muted-foreground p-2">
                    Searching…
                  </div>
                ) : usersFollow.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">
                    No users found
                  </div>
                ) : (
                  <>
                    {usersFollow.map((u) => (
                      <div className="flex w-full justify-between items-center">
                        <p>{u.fullName}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => {
                                addFriend(u._id);
                              }}
                              variant="secondary"
                            >
                              follow
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>add to friends</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {authUser && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="size-4" />
                    <span className="hidden sm:inline ml-2">Profile</span>
                  </Link>
                </Button>

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
