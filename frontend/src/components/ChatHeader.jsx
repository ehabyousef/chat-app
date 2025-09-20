import { useMessageStore } from "@/store/useMessagesStore";
import { X } from "lucide-react";

function ChatHeader({ selectedUser }) {
  const { nullSelectedUser } = useMessageStore();

  return (
    <div className="pl-4 bg-card w-full h-16 flex justify-between items-center">
      <div className="pl-2 flex gap-2 h-16 py-2">
        <img
          src={selectedUser?.profilePic}
          alt=""
          className="rounded-xl w-14 object-cover"
        />
        <div className="flex flex-col items-start justify-between">
          <p className="text-primary">{selectedUser.fullName}</p>
          <p>offline</p>
        </div>
      </div>
      <div onClick={() => nullSelectedUser()} className="pr-4 cursor-pointer">
        <X
          size={25}
          className="cursor-pointer text-primary hover:size-7 transition-all"
        />
      </div>
    </div>
  );
}

export default ChatHeader;
