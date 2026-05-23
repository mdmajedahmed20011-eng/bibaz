/**
 * BIBAZ — TypeScript Type Definitions
 * Centralized types for the entire application
 */

// ═══════════════════════════════════════════
// User Types
// ═══════════════════════════════════════════
export type Role = "CUSTOMER" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    image: string | null;
    emailVerified: Date | null;
    createdAt: Date;
}

// ═══════════════════════════════════════════
// Product Types
// ═══════════════════════════════════════════
export type ProductStatus = "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId: string;
    status: ProductStatus;
    isFeatured: boolean;
    seoTitle: string | null;
    seoDesc: string | null;
    ogImage: string | null;
    createdAt: Date;
    updatedAt: Date;
    category?: Category;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    size: string | null;
    color: string | null;
    price: number;
    stock: number;
    images: string[];
    isActive: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    children?: Category[];
    products?: Product[];
}

// ═══════════════════════════════════════════
// Order Types
// ═══════════════════════════════════════════
export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED"
    | "REFUNDED";

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";
export type PaymentStatus = "UNPAID" | "PAID" | "PARTIALLY_REFUNDED" | "REFUNDED" | "FAILED";

export interface Order {
    id: string;
    orderNumber: string;
    userId: string | null;
    guestEmail: string | null;
    guestPhone: string;
    guestName: string | null;
    shippingAddress: ShippingAddress;
    status: OrderStatus;
    subtotal: number;
    shippingCharge: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    couponId: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    items?: OrderItem[];
    timeline?: OrderTimeline[];
}

export interface OrderItem {
    id: string;
    orderId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    variant?: ProductVariant;
}

export interface OrderTimeline {
    id: string;
    orderId: string;
    status: OrderStatus;
    note: string | null;
    createdBy: string | null;
    createdAt: Date;
}

export interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    postalCode: string;
}

// ═══════════════════════════════════════════
// Cart Types
// ═══════════════════════════════════════════
export interface CartItem {
    variantId: string;
    quantity: number;
    variant?: ProductVariant;
    product?: Product;
}

// ═══════════════════════════════════════════
// Coupon Types
// ═══════════════════════════════════════════
export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minOrder: number | null;
    maxUses: number | null;
    usedCount: number;
    isActive: boolean;
    expiresAt: Date | null;
}

// ═══════════════════════════════════════════
// API Response Types
// ═══════════════════════════════════════════
export interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        fields?: Record<string, string>;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ═══════════════════════════════════════════
// Filter & Sort Types
// ═══════════════════════════════════════════
export interface ProductFilters {
    categoryId?: string;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    search?: string;
}

export type SortOption =
    | "newest"
    | "price_asc"
    | "price_desc"
    | "popular"
    | "name_asc";
