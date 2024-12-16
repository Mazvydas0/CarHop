"use client";
import { useXMTP } from "@/context/XMTPProvider";
import { useChatContext } from "@/context/ChatProvider";
import { ChatWindowComponent } from "@/components/home/ChatWindow";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChatWindow() {
  const { xmtpClient, isXmtpInitialized, initializeXmtp } = useXMTP();
  const { getChatParticipants } = useChatContext();
  const router = useRouter();
  const { chatId } = useParams();

  const [participant1, setParticipant1] = useState(null);
  const [participant2, setParticipant2] = useState(null);

  useEffect(() => {
    if (!isXmtpInitialized && !xmtpClient) {
      initializeXmtp();
    }
  }, [isXmtpInitialized, xmtpClient, initializeXmtp]);

  useEffect(() => {
    if (!chatId) {
      router.push("/home/inbox");
      return;
    }

    const participants = getChatParticipants(chatId);

    if (participants) {
      setParticipant1(participants.sender);
      setParticipant2(participants.receiver);
    } else {
      router.push("/home/inbox");
    }
  }, [chatId, getChatParticipants, router]);

  const isLoading =
    !isXmtpInitialized || !xmtpClient || !participant1 || !participant2;

  if (isLoading) {
    return <div>Loading chat session...</div>;
  }

  return (
    <ChatWindowComponent
      participant1={participant1}
      participant2={participant2}
    />
  );
}
