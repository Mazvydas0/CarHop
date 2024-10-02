"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  CarFront,
  Mail,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-teal-500 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="flex items-center space-x-2">
          <h1 className="flex items-center text-2xl font-bold text-white font-yeseva ">
            CarHop
            <span className="ml-2 inline-block animate-bounce">
              <CarFront className="h-6 w-6 transform rotate-12" />
            </span>
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href={`/home/addTrip`}>
            <Button variant="secondary" size="sm" className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" />
              Add a Trip
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Search className="mr-2 h-4 w-4" />
            Search a Trip
          </Button>

          <Link href="/messages" className="text-white hover:text-teal-100">
            <Mail className="h-6 w-6" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 rounded-full">
                <Image
                  src="/images/ProfilePic.jpg"
                  alt="User profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>
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
