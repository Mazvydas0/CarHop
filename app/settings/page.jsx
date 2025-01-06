import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Work in Progress</AlertTitle>
        <AlertDescription>
          We're currently working on this page. Check back soon for updates!
        </AlertDescription>
      </Alert>
      <div className="mt-8">
        <Button asChild>
          <Link href="/home">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
