"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Car } from "lucide-react";
import Link from "next/link";

export default function LoginFormComponent() {
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
            <Button className="w-full" disabled>
              Login
            </Button>
            <Link href="/register">
              <Button className="w-full" variant="outline">
                Register
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email-login">Email address</Label>
              <Input
                id="email-login"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password-login">Password</Label>
              <Input
                id="password-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative flex w-full justify-center bg-teal-400 hover:bg-teal-500"
              disabled={isLoading}
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Sign in
                  <Car className="ml-2 h-5 w-5 animate-bounce" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
