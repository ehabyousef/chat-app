import { useMessageStore } from "@/store/useMessagesStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { MessageSkeleton } from "./MessageSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "@/store/useAuthStore";
import { Ellipsis, MessageSquare } from "lucide-react";

function MessageBox({ open, selectedUser }) {
  const {
    isLoadingMessages,
    messages,
    getMessages,
    subscripeToMessage,
    unSubscripeFromMessage,
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
                // Convert to string for consistent comparison
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
                          } `}
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
                            className={`absolute ${
                              isMyMessage ? "left-0.5" : "right-0.5"
                            } top-0  cursor-pointer px-1`}
                          >
                            <Ellipsis size={16} />
                          </div>
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
