import { and, eq } from "drizzle-orm";
import type { KoFiWebhookData } from "@/lib/zod/kofi";
import { db } from "@/server/db";
import { donations } from "@/server/db/schema";

// Return type for tracking donation processing status and outcomes
type RecordDonationResult = {
	success: boolean;
	reason: "inserted" | "skipped_owner" | "duplicate" | "error";
	message: string;
};

/**
 * Records a Ko-fi donation in our database after validation and checks.
 * Handles duplicate prevention and owner test donations.
 *
 * @param kofiData - Validated webhook data from Ko-fi containing donation details
 * @returns Object containing processing status, reason, and a human-readable message
 * @throws Will not throw, but returns error status if database operations fail
 */
export async function recordKofiDonation(
	kofiData: KoFiWebhookData,
): Promise<RecordDonationResult> {
	const ownerUsername = process.env.KOFI_OWNER_USERNAME;
	// Skip processing if it's a test donation from the Ko-fi account owner
	if (
		ownerUsername &&
		kofiData.from_name.toLowerCase() === ownerUsername.toLowerCase()
	) {
		return {
			success: true,
			reason: "skipped_owner",
			message: `Skipping donation from owner (${kofiData.from_name}). This is likely a test.`,
		};
	}

	try {
		// Check if we've already processed this donation
		const existingDonation = await db.query.donations.findFirst({
			where: and(
				eq(donations.provider, "kofi"),
				eq(donations.providerTransactionId, kofiData.kofi_transaction_id),
			),
		});

		if (existingDonation) {
			return {
				success: true,
				reason: "duplicate",
				message: `Skipping duplicate donation from Ko-fi: ${kofiData.kofi_transaction_id}`,
			};
		}

		// Prepare donation data for storage, removing sensitive info and converting amount to cents

		// biome-ignore lint/correctness/noUnusedVariables: This is fine because we are destructuring to remove a field
		const { verification_token, ...safeRawData } = kofiData;
		const amountInCents = Math.round(Number.parseFloat(kofiData.amount) * 100);

		const normalizedDonation = {
			provider: "kofi",
			providerTransactionId: kofiData.kofi_transaction_id,
			amountInCents: amountInCents,
			currency: kofiData.currency,
			donatorName: kofiData.from_name,
			donatorMessage: kofiData.message,
			donatedAt: new Date(kofiData.timestamp),
			rawData: safeRawData,
		};

		// Store the donation in our database
		await db.insert(donations).values(normalizedDonation);

		return {
			success: true,
			reason: "inserted",
			message: `Successfully recorded donation from ${normalizedDonation.donatorName}!`,
		};
	} catch (error) {
		console.error("Failed to process donation:", error);
		return {
			success: false,
			reason: "error",
			message: "A database error occurred while processing the donation.",
		};
	}
}
