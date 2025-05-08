import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

export function BlogLayout({ children }: LayoutProps) {
	return <main className="w-full">{children}</main>;
}
