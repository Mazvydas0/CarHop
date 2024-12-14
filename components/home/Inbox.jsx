"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useXMTP } from "@/context/XMTPProvider";
import { useChatContext } from "@/context/ChatProvider";
import { useRouter } from "next/navigation";

export function Inbox() {
  const { xmtpClient, isXmtpInitialized } = useXMTP();
  const { chats, createNewChat } = useChatContext();
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isXmtpInitialized || !xmtpClient) {
        alert("XMTP is not initialized. Please wait.");
        return;
      }

      try {
        const conversationList = await xmtpClient.conversations.list();
        const chatPreviews = await Promise.all(
          conversationList.map(async (conversation) => {
            const messages = await conversation.messages({ limit: 1 });
            const lastMessage = messages[0]?.content || "No messages yet";
            const timestamp = messages[0]?.sent || new Date();

            let chatId = Object.keys(chats).find(
              (id) =>
                chats[id].sender === conversation.peerAddress ||
                chats[id].receiver === conversation.peerAddress
            );

            if (!chatId) {
              chatId = createNewChat(
                xmtpClient.address,
                conversation.peerAddress
              );
            }

            return {
              id: chatId,
              recipient: conversation.peerAddress,
              lastMessage,
              timestamp: new Date(timestamp).toLocaleTimeString(),
            };
          })
        );
        setConversations(chatPreviews);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations.");
      }
    };

    if (xmtpClient && isXmtpInitialized) {
      fetchConversations();
    }
  }, [xmtpClient, isXmtpInitialized, chats, createNewChat]);

  const handleChatClick = (chatId) => {
    router.push(`/home/inbox/${chatId}`);
  };

  if (!isXmtpInitialized) {

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl pb-4 font-semibold text-teal-600">Inbox</h1>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-0 text-center">Initialize XMTP at the Metamask extension...</CardContent>
        </Card>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl pb-4 font-semibold text-teal-600">Inbox</h1>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-0 text-center">
            No chats available....
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl pb-4 font-semibold text-teal-600">Inbox</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-0">
          <ScrollArea className="h-[70vh]">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleChatClick(chat.id)}
              >
                <Avatar>
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=${chat.recipient.charAt(
                      0
                    )}`}
                    alt={chat.recipient}
                  />
                  <AvatarFallback>{chat.recipient.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.recipient}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage.length > 20
                      ? `${chat.lastMessage.substring(0, 25)}...`
                      : chat.lastMessage}
                  </p>
                </div>
                <div className="text-xs text-gray-400">{chat.timestamp}</div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
