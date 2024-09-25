"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Car } from "lucide-react";
import Link from "next/link";

export default function RegisterFormComponent() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to CarHop
          </h2>
          <p className="mt-2 text-sm text-gray-600">Your journey begins here</p>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-2">
            <Link href="/login">
              <Button className="w-full" variant="outline">
                Login
              </Button>
            </Link>
            <Button className="w-full" disabled>
              Register
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="name-register">Full Name</Label>
              <Input
                id="name-register"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-register">Email address</Label>
              <Input
                id="email-register"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password-register">Password</Label>
              <Input
                id="password-register"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Link href="/home">
              <Button
                type="submit"
                className="group relative flex w-full justify-center bg-teal-400 hover:bg-teal-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Sign up
                    <Car className="ml-2 h-5 w-5 animate-bounce" />
                  </>
                )}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
