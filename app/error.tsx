"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="border-destructive max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mb-4">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
