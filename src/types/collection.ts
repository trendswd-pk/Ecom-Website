export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  show_in_menu: boolean;
  created_at: string;
  updated_at: string;
};

export type CollectionListItem = Pick<
  Collection,
  "id" | "name" | "slug" | "sort_order" | "created_at"
> & {
  product_count: number;
};

export type MenuCollection = Pick<Collection, "name" | "slug">;

export type CollectionFormPayload = {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  productIds: string[];
};
