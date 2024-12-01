export const COUPON_CODES={
    XMAS2024:"XMAS2024",
    NY2025:"NY2025",
    BIJ2024:"BIJ2024",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;