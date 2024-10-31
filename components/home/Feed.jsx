import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Car,
  Package,
  Rocket,
} from "lucide-react";
import FeedLegend from "./FeedLegend";
import Image from "next/image";

const feedData = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    content:
      "Just finished an amazing road trip from NYC to LA! CarHop made it so easy to find ride-sharing partners along the way. Anyone interested in going back together? #RoadTrip #CarHopAdventure",
    date: "2023-06-10T14:30:00Z",
    likes: 42,
    comments: 7,
    type: "carpool",
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    content:
      "Heading to Coachella this weekend! Anyone else using CarHop to get there? Let's share rides and save on parking! #Coachella #RideSharing",
    date: "2023-06-09T10:15:00Z",
    likes: 38,
    comments: 12,
    type: "looking",
  },
  {
    id: 3,
    author: "Bob Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=BJ",
    content:
      "Used CarHop to send a package across state lines. It arrived safely and I saved so much on shipping! This app is a game-changer. #PackageDelivery #CarHopWin",
    date: "2023-06-08T16:45:00Z",
    likes: 27,
    comments: 5,
    type: "package",
  },
];

const PostTypeIcon = ({ type }) => {
  switch (type) {
    case "carpool":
      return <Car className="h-5 w-5 text-blue-500" />;
    case "package":
      return <Package className="h-5 w-5 text-green-500" />;
    case "looking":
      return <Rocket className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

export default function Feed() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold text-teal-700">CarHop Feed</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <ScrollArea className="h-[80vh]">
            <div className="space-y-4">
              {feedData
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((post) => (
                  <Card key={post.id} className="w-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <PostTypeIcon type={post.type} />
                          <Avatar>
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback>
                              <Image
                                src="/images/noProfile.png"
                                alt="no profile picture"
                                width={40}
                                height={40}
                              />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {post.author}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              {new Date(post.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Hide post</DropdownMenuItem>
                            <DropdownMenuItem>
                              Block {post.author}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2"
                      >
                        <Heart className="h-5 w-5 text-gray-500" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2"
                      >
                        <MessageCircle className="h-5 w-5 text-gray-500" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost">
                        <Share2 className="h-5 w-5 text-gray-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="md:w-1/4">
          <div className="sticky top-4">
            <FeedLegend />
          </div>
        </div>
      </div>
    </div>
  );
}

