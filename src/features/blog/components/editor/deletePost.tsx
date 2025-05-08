"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirmation";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface DeletePostProps {
	id: number;
}

export const DeletePost = ({ id }: DeletePostProps) => {
	const router = useRouter();
	const { mutate, isPending } = api.blog.deletePost.useMutation({
		onSuccess: () => {
			router.push("/admin");
		},
	});

	return (
		<ConfirmDialog
			trigger={
				<Button variant="destructive" disabled={isPending}>
					{isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
					{isPending ? "Deleting..." : "Delete"}
				</Button>
			}
			title="Delete post?"
			description="Are you sure you want to delete this post? This action cannot be undone."
			confirmLabel="Delete"
			cancelLabel="Cancel"
			onConfirm={() => mutate({ id })}
		/>
	);
};
