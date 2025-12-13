import { TProduct } from "./Product";

export type CartItem = {
  id: number;
  isSelected: boolean;
  product: TProduct;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};


export type Cart = {
  id: number;
  items: CartItem[];
  totalPrice: number;
};