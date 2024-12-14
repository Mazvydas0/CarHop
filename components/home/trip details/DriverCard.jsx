"use client";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Star, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatProvider";
import { useXMTP } from "@/context/XMTPProvider";

export default function DriverCard({
  driver,
  driverAverageRating,
  driverRatingCount,
}) {
  const router = useRouter();
  const { createNewChat } = useChatContext();
  const { xmtpClient, isXmtpInitialized } = useXMTP();

  const handleMessageClick = async () => {
    // Ensure XMTP is initialized
    if (!isXmtpInitialized) {
      alert("XMTP is not initialized. Check your metamask extension and try again.");
      return;
    }

    // Ensure we have a connected wallet (sender)
    if (!xmtpClient?.address) {
      alert("Please connect your wallet first.");
      return;
    }

    // Validate driver address
    if (!driver) {
      alert("Driver address is not available.");
      return;
    }

    if(driver === xmtpClient.address) {
      alert("You cannot message yourself.");
      return;
    }

    try {
      const chatId = createNewChat(xmtpClient.address, driver);

      router.push(`/home/inbox/${chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <Image
            src="/images/noProfile.png"
            alt="Driver"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">{driver || "Driver Name"}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2">
                {driverAverageRating > 0
                  ? `${(driverAverageRating / 100)
                      .toFixed(2)
                      .replace(".", ",")} (${driverRatingCount})`
                  : `0,00 (${driverRatingCount})`}
              </span>
            </div>
            <p className="mt-2 text-gray-600">Vehicle details placeholder</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm" onClick={handleMessageClick}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
