export type Product = {
  productId: string;
  quantity: number;
  price: number;
  name: string
};

export type CartResponse = {
  _id: string;
  userId: string;
  products: Product[];
};
