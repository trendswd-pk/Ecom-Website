export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  category_id: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: OrderStatus;
};

export type NewProductInput = {
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};
