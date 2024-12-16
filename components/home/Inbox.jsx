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
            // Fetch multiple messages and sort to get the latest
            const messages = await conversation.messages({ limit: 50 });
            const sortedMessages = messages.sort(
              (a, b) => new Date(b.sent).getTime() - new Date(a.sent).getTime()
            );

            const lastMessage = sortedMessages[0]?.content || "No messages yet";
            const timestamp = sortedMessages[0]?.sent || new Date();

            // Check if a chat already exists using the conversation's unique topic or peer addresses
            let chatId = Object.keys(chats).find(
              (id) =>
                (chats[id].sender === conversation.peerAddress &&
                  chats[id].receiver === xmtpClient.address) ||
                (chats[id].sender === xmtpClient.address &&
                  chats[id].receiver === conversation.peerAddress) ||
                chats[id].topic === conversation.topic
            );

            // If no existing chat is found, create a new one
            if (!chatId) {
              chatId = createNewChat(
                xmtpClient.address,
                conversation.peerAddress,
                conversation.topic
              );
            }
            // Log the details for debugging
            console.log("Chat ID:", chatId);
            console.log("Recipient Address:", conversation.peerAddress);
            console.log("Sender Address:", xmtpClient.address);
            console.log("Last Message:", lastMessage);
            console.log("Timestamp:", new Date(timestamp).toLocaleTimeString());
            console.log("Conversation Metadata:", conversation);

            return {
              id: chatId,
              recipient: conversation.peerAddress,
              lastMessage,
              timestamp: new Date(timestamp).toLocaleString(), // Changed to include date
            };
          })
        );

        // Sort conversations by most recent timestamp
        const sortedConversations = chatPreviews.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setConversations(sortedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        alert("Failed to load conversations.");
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
          <CardContent className="p-0 text-center">
            Initialize XMTP at the Metamask extension...
          </CardContent>
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
