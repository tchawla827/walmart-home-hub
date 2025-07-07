export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  /**
   * Some APIs return `title` while others may return `name`.
   * Keep `name` optional for compatibility with locally stored products.
   */
  name?: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
}

export interface GiftItem {
  id?: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface GiftBundle {
  title: string;
  items: GiftItem[];
  totalPrice: number;
  /** Percentage discount applied to the bundle price */
  discountPercent?: number;
}
