import { z } from "zod";

// Helper schemas for nested objects
const koFiShopItemSchema = z.object({
	direct_link_code: z.string(),
	variation_name: z.string(),
	quantity: z.number().int(),
});

const koFiShippingDetailsSchema = z.object({
	full_name: z.string(),
	street_address: z.string(),
	city: z.string(),
	state_or_province: z.string(),
	postal_code: z.string(),
	country: z.string(),
	country_code: z.string(),
	telephone: z.string(),
});

// Base schema with fields common to all types
const koFiWebhookBaseSchema = z.object({
	verification_token: z.string().uuid(),
	message_id: z.string().uuid(),
	timestamp: z.string().datetime(),
	is_public: z.boolean(),
	from_name: z.string(),
	message: z.string().nullable(),
	amount: z.string(),
	url: z.string().url(),
	email: z.string().email(),
	currency: z.string(),
	kofi_transaction_id: z.string().uuid(),
});

// Schema for 'Donation' type
const koFiDonationSchema = koFiWebhookBaseSchema.extend({
	type: z.literal("Donation"),
	is_subscription_payment: z.literal(false),
	is_first_subscription_payment: z.literal(false),
	tier_name: z.null(),
	shop_items: z.null(),
	shipping: z.null(),
});

// Schema for 'Subscription' type
const koFiSubscriptionSchema = koFiWebhookBaseSchema.extend({
	type: z.literal("Subscription"),
	is_subscription_payment: z.literal(true),
	is_first_subscription_payment: z.boolean(),
	tier_name: z.string().nullable(),
	shop_items: z.null(),
	shipping: z.null(),
});

// Schema for 'Shop Order' type
const koFiShopOrderSchema = koFiWebhookBaseSchema.extend({
	type: z.literal("Shop Order"),
	is_subscription_payment: z.literal(false),
	is_first_subscription_payment: z.literal(false),
	tier_name: z.null(),
	shop_items: z.array(koFiShopItemSchema),
	shipping: koFiShippingDetailsSchema,
});

export const koFiWebhookSchema = z.discriminatedUnion("type", [
	koFiDonationSchema,
	koFiSubscriptionSchema,
	koFiShopOrderSchema,
]);

export type KoFiWebhookData = z.infer<typeof koFiWebhookSchema>;
