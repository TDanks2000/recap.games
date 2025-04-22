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
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function GamesList() {
  const utils = api.useUtils();
  const { data: games, isLoading } = api.game.getAll.useQuery({
    includeHidden: true,
  });
  const [gameToDelete, setGameToDelete] = useState<number | null>(null);

  const deleteGameMutation = api.game.delete.useMutation({
    onSuccess: () => {
      toast.success("Game deleted successfully");
      utils.game.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Error deleting game: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    setGameToDelete(id);
  };

  const confirmDelete = () => {
    if (gameToDelete !== null) {
      deleteGameMutation.mutate({ id: gameToDelete });
      setGameToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={`game-skeleton-${i}`} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return <p className="text-muted-foreground">No games found.</p>;
  }

  return (
    <>
      <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
        {games.map((game) => (
          <div key={game.id} className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{game.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {game.releaseDate || "No release date"}
                  {game.hidden && " • Hidden"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {game.media.length} media items •
                  {game.conference
                    ? `Conference: ${game.conference.name}`
                    : "No conference"}
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-start">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`/admin/games/edit/${game.id}`}
                    aria-label={`Edit ${game.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(game.id)}
                  disabled={deleteGameMutation.isPending}
                  aria-label={`Delete ${game.title}`}
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
        open={gameToDelete !== null}
        onOpenChange={(open) => !open && setGameToDelete(null)}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              game and remove it from our servers.
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
