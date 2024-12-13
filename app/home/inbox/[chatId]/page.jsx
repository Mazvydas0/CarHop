"use client";
import { useXMTP } from "@/context/XMTPProvider";
import { ChatWindowComponent } from "@/components/home/ChatWindow";
import { useEffect } from "react";

export default function ChatWindow() {
  const { xmtpClient, isXmtpInitialized, initializeXmtp } = useXMTP();

  const passenger1 = "0x2ed96BA3DB0a6daaE78bdB7C869f522E55DdE910";

  // Additional initialization if needed
  useEffect(() => {
    if (!xmtpClient && !isXmtpInitialized) {
      initializeXmtp();
    }
  }, [xmtpClient, isXmtpInitialized, initializeXmtp]);

  // Loading state
  if (!isXmtpInitialized) {
    return <div>Initializing XMTP...</div>;
  }

  // Error state if client is not created
  if (!xmtpClient) {
    return <div>Failed to initialize XMTP client</div>;
  }

  return (
    <div className="mt-12">
      <ChatWindowComponent
        xmtpClient={xmtpClient}
        recipientAddress={passenger1}
      />
    </div>
  );
}
