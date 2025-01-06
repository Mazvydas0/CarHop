import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatProvider";
import { useXMTP } from "@/context/XMTPProvider";

export default function MessageButton({ recipientAddress }) {
  const router = useRouter();
  const { createNewChat } = useChatContext();
  const { xmtpClient, isXmtpInitialized } = useXMTP();

  const handleMessageClick = async () => {
    if (!isXmtpInitialized) {
      alert(
        "XMTP is not initialized. Check your metamask extension and try again."
      );
      return;
    }

    if (!xmtpClient?.address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!recipientAddress) {
      alert("Recipient address is not available.");
      return;
    }

    if (recipientAddress === xmtpClient.address) {
      alert("You cannot message yourself.");
      return;
    }

    try {
      const chatId = createNewChat(xmtpClient.address, recipientAddress);
      router.push(`/home/inbox/${chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleMessageClick}>
      <MessageCircle className="mr-2 h-4 w-4" />
      Message
    </Button>
  );
}
