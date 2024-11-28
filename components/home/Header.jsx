import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CarFront,
  Mail,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MetaButton from "../metamask/MetaButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="flex items-center space-x-2">
          <h1 className="flex items-center text-2xl font-bold text-white font-yeseva">
            CarHop
            <span className="ml-2 inline-block animate-bounce">
              <CarFront className="h-6 w-6 transform rotate-12" />
            </span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/home/feed">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-teal-400 hover:text-white"
            >
              <Newspaper className="mr-2 h-4 w-4" />
              Feed
            </Button>
          </Link>
          <Link href="/home/addTrip">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-teal-400 hover:text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a Trip
            </Button>
          </Link>
          <Link href="/home/findTrip">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-teal-400 hover:text-white"
            >
              <Search className="mr-2 h-4 w-4" />
              Search a Trip
            </Button>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <MetaButton />
          <Link
            href="/home/inbox"
            className="text-white hover:text-teal-100 relative"
          >
            <Mail className="h-6 w-6" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-8 w-8 rounded-full">
                <Image
                  src="/images/ProfilePic.jpg"
                  alt="User profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
