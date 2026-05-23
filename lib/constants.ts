/**
 * BIBAZ — Application Constants
 * SOP §৬ — Business Logic Constants
 */

// Delivery Charges (BDT)
export const DELIVERY_CHARGE = {
    DHAKA_INSIDE: 80,
    OUTSIDE_DHAKA: 150,
} as const;

// Order Number Prefix
export const ORDER_PREFIX = "ORD";

// Product Status
export const PRODUCT_STATUS = {
    DRAFT: "DRAFT",
    ACTIVE: "ACTIVE",
    OUT_OF_STOCK: "OUT_OF_STOCK",
    ARCHIVED: "ARCHIVED",
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    RETURNED: "RETURNED",
    REFUNDED: "REFUNDED",
} as const;

// Payment Methods
export const PAYMENT_METHOD = {
    COD: "COD",
    BKASH: "BKASH",
    NAGAD: "NAGAD",
    SSLCOMMERZ: "SSLCOMMERZ",
} as const;

// Rate Limiting (SOP §৪D)
export const RATE_LIMITS = {
    LOGIN: { requests: 5, window: "15m" },
    REGISTER: { requests: 3, window: "1h" },
    PASSWORD_RESET: { requests: 3, window: "1h" },
    CHECKOUT: { requests: 10, window: "1m" },
    API: { requests: 100, window: "1m" },
    ADMIN: { requests: 50, window: "1m" },
} as const;

// Image Upload Limits (SOP §৪G)
export const UPLOAD_LIMITS = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    MAX_DIMENSION: 4000,
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 48,
} as const;

// Session & Auth (SOP §৪A)
export const AUTH = {
    ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes in seconds
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
    ADMIN_SESSION_TIMEOUT: 30 * 60, // 30 minutes in seconds
    BCRYPT_SALT_ROUNDS: 12,
    PASSWORD_RESET_EXPIRY: 60 * 60, // 1 hour in seconds
} as const;

// Business Info
export const BUSINESS = {
    NAME: "BIBAZ",
    PHONE: "+880 1860-744181",
    EMAIL: "habiba13.hafiz@gmail.com",
    ADDRESS:
        "Road: 10, House: 60, Block: D, 1st Floor, Nest Mega Mall, Banani, Dhaka, Bangladesh - 1216",
    FACEBOOK: "https://www.facebook.com/bibaz07/",
    INSTAGRAM: "https://www.instagram.com/bibaz_2015",
} as const;

// Currency
export const CURRENCY = {
    CODE: "BDT",
    SYMBOL: "৳",
    LOCALE: "en-BD",
} as const;
