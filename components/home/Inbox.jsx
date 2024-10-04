"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chats } from "@/utils/Chats";
import Link from "next/link";

export function Inbox() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl pb-4 font-semibold text-teal-600">Inbox</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-0">
          <ScrollArea className="h-[70vh]">
            {chats.map((chat) => (
              <Link href={`/home/inbox/${chat.id}`}>
                <div
                  key={chat.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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
              </Link>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
