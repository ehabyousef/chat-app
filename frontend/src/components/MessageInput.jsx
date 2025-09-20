import { useMessageStore } from "@/store/useMessagesStore";
import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function MessageInput() {
  const [text, settext] = useState("");
  const [imagePreview, setimagePreview] = useState("");
  const { sendMessages, isSendingMessages } = useMessageStore();
  const fileInputRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setimagePreview(reader.result);
    };
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // Only block if both are empty

    try {
      await sendMessages({ text: text.trim(), image: imagePreview });
      settext("");
      setimagePreview(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="img"
              className="size-28 rounded-xl object-cover border-zinc-700"
            />
            <button
              onClick={() => setimagePreview(null)}
              className="absolute -top-1.5 -right-1.5 size-6 bg-primary text-primary-foreground cursor-pointer rounded-full flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={submitMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="type a message"
            className="border border-zinc-600 w-full p-3 rounded-lg"
            value={text}
            onChange={(e) => settext(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex items-center ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            } cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={25} />
          </button>
          <button
            type="submit"
            className={`hidden sm:flex items-center text-primary cursor-pointer`}
            disabled={!text.trim() && !imagePreview}
          >
            {isSendingMessages ? (
              <div className="">sending...</div>
            ) : (
              <Send size={25} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
