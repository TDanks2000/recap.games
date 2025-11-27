"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RetryButton() {
	return (
		<Button
			variant="default"
			size="sm"
			onClick={() => window.location.reload()}
			className="gap-2"
		>
			<RefreshCw className="h-4 w-4" />
			Retry
		</Button>
	);
}
