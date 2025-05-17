// app/auth/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	robots: "noindex, nofollow",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
	return children;
}
