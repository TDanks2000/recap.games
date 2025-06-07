// src/app/api/kofi/route.ts

import { NextResponse } from "next/server";
import { recordKofiDonation } from "@/lib/db/donations/kofi";
import { koFiWebhookSchema } from "@/lib/zod/kofi";

export async function POST(request: Request) {
	const formData = await request.formData();
	const rawData = formData.get("data");

	if (typeof rawData !== "string") {
		return NextResponse.json({ message: "Invalid request" }, { status: 400 });
	}

	const validationResult = koFiWebhookSchema.safeParse(JSON.parse(rawData));

	if (!validationResult.success) {
		console.error("Invalid Ko-fi payload:", validationResult.error.flatten());
		return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
	}

	const kofiData = validationResult.data;

	if (kofiData.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const result = await recordKofiDonation(kofiData);

	console.log(result.message);

	if (!result.success) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true });
}
