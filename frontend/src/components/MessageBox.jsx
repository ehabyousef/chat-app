import { useMessageStore } from "@/store/useMessagesStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { MessageSkeleton } from "./MessageSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "@/store/useAuthStore";
import { Ellipsis, MessageSquare, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

function MessageBox({ open, selectedUser }) {
  const [openDelId, setOpenDelId] = useState(null); // Track which message ID has delete menu open
  const {
    isLoadingMessages,
    messages,
    getMessages,
    subscripeToMessage,
    unSubscripeFromMessage,
    deleteMessage,
  } = useMessageStore();

  const { authUser } = useAuthStore();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);

      subscripeToMessage();
      return () => unSubscripeFromMessage();
    }
  }, [getMessages, selectedUser, subscripeToMessage, unSubscripeFromMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoadingMessages && messages.length === 0)
    return (
      <div
        className={`h-[calc(100vh-92px)] w-screen ${
          open ? "md:w-[calc(100vw-25rem)]" : "md:w-screen"
        } transition-all duration-300`}
      >
        <div className="flex flex-col h-full">
          <ChatHeader selectedUser={selectedUser} />
          <div className="flex-1 overflow-hidden">
            <MessageSkeleton />
          </div>
          <MessageInput />
        </div>
      </div>
    );

  return (
    <div
      className={`h-[calc(100vh-92px)] w-screen ${
        open ? "md:w-[calc(100vw-25rem)]" : "md:w-screen"
      } transition-all duration-300`}
    >
      {!selectedUser || Object.keys(selectedUser).length === 0 ? (
        <div className="h-full flex flex-col gap-3 items-center justify-center">
          <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="size-8 text-primary animate-bounce" />
          </div>
          <h3 className="text-3xl fw-bolder text-primary">welcome to chatty</h3>
          <p className="text-foreground">
            select conversation to start chatting
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader selectedUser={selectedUser} />
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {messages?.map((msg) => {
                const isMyMessage =
                  String(msg.senderId) === String(authUser._id);

                return (
                  <div
                    key={msg._id}
                    className={`flex w-full ${
                      isMyMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-4 max-w-[70%] ${
                        isMyMessage ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className="size-10 flex shrink-0">
                        <img
                          className="rounded-lg"
                          src={
                            isMyMessage
                              ? authUser.profilePic || "../../public/avatar.jpg"
                              : selectedUser.profilePic ||
                                "../../public/avatar.jpg"
                          }
                          alt="avatar"
                        />
                      </div>
                      <div className="space-y-2">
                        <time
                          className={`w-full text-xs flex text-primary ${
                            isMyMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {new Date(msg?.createdAt).toLocaleTimeString()}
                        </time>
                        <div
                          className={`relative w-full flex flex-col gap-4 p-1 rounded-md bg-muted text-foreground ${
                            isMyMessage ? "pl-8" : "pr-10"
                          } backdrop-blur-md bg-opacity-60 shadow-lg border border-white/20`}
                          style={{
                            boxShadow: "rgba(0, 0, 0, 0.12) -13px 8px 24px",
                            background: "rgb(255 255 255 / 13%)",
                          }}
                        >
                          {msg?.image && (
                            <div
                              className={`size-48 flex shrink-0 ${
                                isMyMessage ? "ml-auto" : "ml-0"
                              }`}
                            >
                              <img
                                src={msg.image}
                                alt="message image"
                                className="w-full h-full rounded-xl"
                              />
                            </div>
                          )}
                          {msg?.text && <div>{msg.text}</div>}
                          <div
                            onClick={() =>
                              setOpenDelId(
                                openDelId === msg._id ? null : msg._id
                              )
                            }
                            className={`absolute ${
                              isMyMessage ? "left-0.5" : "right-0.5"
                            } top-0 cursor-pointer px-1`}
                          >
                            <Ellipsis size={16} />
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div
                                style={{
                                  boxShadow: "rgb(0 0 0 / 28%) -2px 8px 9px",
                                  background: "rgb(255 255 255 / 13%)",
                                }}
                                className={`absolute rounded-md p-1 ${
                                  isMyMessage ? "-left-3" : "-right-3"
                                } top-3 cursor-pointer px-1 transition-all duration-200 ease-in-out ${
                                  openDelId === msg._id
                                    ? "opacity-100 scale-100 translate-y-0"
                                    : "opacity-0 scale-75 -translate-y-2 pointer-events-none"
                                }`}
                              >
                                <Trash size={20} className="text-primary" />
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-xs p-4 backdrop-blur-md bg-background/80 border border-white/20 shadow-2xl">
                              <div className="flex flex-col items-center gap-4">
                                <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                  <Trash className="size-6 text-destructive" />
                                </div>
                                <div className="text-center space-y-2">
                                  <h3 className="text-lg font-semibold">
                                    Delete Message
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Are you sure you want to delete this
                                    message? This action cannot be undone.
                                  </p>
                                </div>
                                <div className="flex gap-2 w-full">
                                  <AlertDialogCancel asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 backdrop-blur-sm bg-background/50"
                                    >
                                      Cancel
                                    </Button>
                                  </AlertDialogCancel>
                                  <AlertDialogAction asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="flex-1 backdrop-blur-sm bg-destructive/80 hover:bg-destructive"
                                      onClick={() => deleteMessage(msg._id)}
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogAction>
                                </div>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <MessageInput />
        </div>
      )}
    </div>
  );
}

export default MessageBox;
