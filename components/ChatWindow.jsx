"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hey, are we still on for the trip tomorrow?",
    timestamp: "10:30 AM",
    isSelf: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Yes, definitely! What time should I pick you up?",
    timestamp: "10:32 AM",
    isSelf: true,
  },
  {
    id: 3,
    sender: "John Doe",
    content: "Great! How about 9 AM?",
    timestamp: "10:33 AM",
    isSelf: false,
  },
  {
    id: 4,
    sender: "You",
    content: "Sounds good. I'll be there at 9. See you tomorrow!",
    timestamp: "10:35 AM",
    isSelf: true,
  },
];

export function ChatWindowComponent({ id }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSelf: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col">
      <CardHeader className="bg-teal-500 text-white">
        <CardTitle className="text-xl font-bold flex items-center">
          <Avatar className="mr-2">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40&text=JD"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          John Doe
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-auto" onClick={focusInput}>
        <ScrollArea className="h-full p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.isSelf ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isSelf
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-800"
                } hover:bg-teal-200`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            ref={inputRef}
            className="flex-grow"
          />
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
