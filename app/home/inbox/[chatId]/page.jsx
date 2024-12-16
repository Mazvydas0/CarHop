"use client";
import { useXMTP } from "@/context/XMTPProvider";
import { useChatContext } from "@/context/ChatProvider";
import { ChatWindowComponent } from "@/components/home/ChatWindow";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ChatWindow() {
  const { xmtpClient, isXmtpInitialized, initializeXmtp } = useXMTP();
  const { getChatParticipants } = useChatContext();
  const router = useRouter();

  const { chatId } = useParams();

  const [participant1, setParticipant1] = useState(null);
  const [participant2, setParticipant2] = useState(null);

  useEffect(() => {
    if (!xmtpClient && !isXmtpInitialized) {
      initializeXmtp();
    }

    if (chatId) {
      const participants = getChatParticipants(chatId);

      if (participants) {
        setParticipant1(participants.sender);
        setParticipant2(participants.receiver);
      } else {
        alert("Invalid chat session");
        router.push("/home/inbox");
      }
    }
  }, [chatId, xmtpClient, isXmtpInitialized, initializeXmtp]);

  if (!isXmtpInitialized) {
    return <div>Initializing XMTP...</div>;
  }

  if (!xmtpClient) {
    return <div>Failed to initialize XMTP client</div>;
  }

  if (!participant1 || !participant2) {
    return <div>Loading chat participants...</div>;
  }

  return (
    <ChatWindowComponent
      participant1={participant1}
      participant2={participant2}
    />
  );
}
