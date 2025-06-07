export interface KoFiShopItem {
	direct_link_code: string;
	variation_name: string;
	quantity: number;
}

export interface KoFiShippingDetails {
	full_name: string;
	street_address: string;
	city: string;
	state_or_province: string;
	postal_code: string;
	country: string;
	country_code: string;
	telephone: string;
}

interface KoFiWebhookBase {
	verification_token: string;
	message_id: string;
	timestamp: string;
	is_public: boolean;
	from_name: string;
	message: string | null;
	amount: string;
	url: string;
	email: string;
	currency: string;
	kofi_transaction_id: string;
}

export interface KoFiDonationData extends KoFiWebhookBase {
	type: "Donation";
	is_subscription_payment: false;
	is_first_subscription_payment: false;
	tier_name: null;
	shop_items: null;
	shipping: null;
}

export interface KoFiSubscriptionData extends KoFiWebhookBase {
	type: "Subscription";
	is_subscription_payment: true;
	is_first_subscription_payment: boolean;
	tier_name: string | null;
	shop_items: null;
	shipping: null;
}

export interface KoFiShopOrderData extends KoFiWebhookBase {
	type: "Shop Order";
	is_subscription_payment: false;
	is_first_subscription_payment: false;
	tier_name: null;
	shop_items: KoFiShopItem[];
	shipping: KoFiShippingDetails;
}

export type KoFiWebhookData =
	| KoFiDonationData
	| KoFiSubscriptionData
	| KoFiShopOrderData;
