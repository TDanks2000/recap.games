"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function StreamsList() {
  const utils = api.useUtils();
  const { data: streams, isLoading } = api.stream.getAll.useQuery();
  const [streamToDelete, setStreamToDelete] = useState<number | null>(null);

  const deleteStreamMutation = api.stream.delete.useMutation({
    onSuccess: () => {
      toast.success("Stream deleted successfully");
      utils.stream.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Error deleting stream: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    setStreamToDelete(id);
  };

  const confirmDelete = () => {
    if (streamToDelete !== null) {
      deleteStreamMutation.mutate({ id: streamToDelete });
      setStreamToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={`stream-skeleton-${i}`} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!streams || streams.length === 0) {
    return <p className="text-muted-foreground">No streams found.</p>;
  }

  return (
    <>
      <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
        {streams.map((stream) => (
          <div key={stream.id} className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{stream.title}</h3>
                <p className="text-muted-foreground text-sm">
                  Conference ID: {stream.conferenceId}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <a
                    href={stream.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 text-xs hover:underline"
                  >
                    View Stream <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-start">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`/admin/streams/edit/${stream.id}`}
                    aria-label={`Edit ${stream.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(stream.id)}
                  disabled={deleteStreamMutation.isPending}
                  aria-label={`Delete ${stream.title}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>

      <AlertDialog
        open={streamToDelete !== null}
        onOpenChange={(open) => !open && setStreamToDelete(null)}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              stream and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
