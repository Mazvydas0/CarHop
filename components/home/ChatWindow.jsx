"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useXMTP } from "@/context/XMTPProvider";

export function ChatWindowComponent({ participant1, participant2 }) {
  const { xmtpClient, isXmtpInitialized } = useXMTP();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);

  const recipientAddress =
    participant1 === xmtpClient?.address ? participant2 : participant1;

  useEffect(() => {
    if (!xmtpClient || !recipientAddress || !isXmtpInitialized) return;

    const loadMessages = async () => {
      try {
        const conversation = await xmtpClient.conversations.newConversation(
          recipientAddress
        );

        const fetchedMessages = await conversation.messages();
        setMessages(
          fetchedMessages.map((msg) => ({
            id: msg.id,
            sender: msg.senderAddress,
            content: msg.content,
            timestamp: new Date(msg.sent).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSelf: msg.senderAddress === xmtpClient.address,
          }))
        );

        const stream = await conversation.streamMessages();
        (async () => {
          for await (const msg of stream) {
            setMessages((prevMessages) => {
              // Check if message already exists
              if (prevMessages.some((m) => m.id === msg.id)) {
                return prevMessages;
              }
              return [
                ...prevMessages,
                {
                  id: msg.id,
                  sender: msg.senderAddress,
                  content: msg.content,
                  timestamp: new Date(msg.sent).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isSelf: msg.senderAddress === xmtpClient.address,
                },
              ];
            });
          }
        })();
      } catch (error) {
        console.error("Failed to load or subscribe to messages:", error);
      }
    };

    loadMessages();
  }, [xmtpClient, recipientAddress, isXmtpInitialized]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !xmtpClient || !recipientAddress) return;

    try {
      const conversation = await xmtpClient.conversations.newConversation(
        recipientAddress
      );
      await conversation.send(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  if (!isXmtpInitialized) {
    return <div>Initializing XMTP...</div>;
  }

  if (!xmtpClient) {
    return <div>Failed to initialize XMTP client</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col">
      <CardHeader className="bg-teal-500 text-white">
        <CardTitle className="text-xl font-bold flex items-center">
          <Avatar className="mr-2">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40&text=JD"
              alt="Chat Partner"
            />
            <AvatarFallback>{recipientAddress?.slice(0, 6)}</AvatarFallback>
          </Avatar>
          {recipientAddress}
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
