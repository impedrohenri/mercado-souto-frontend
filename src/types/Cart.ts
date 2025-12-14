import { TProduct } from "./Product";

export type TCartItem = {
  id: number;
  isSelected: boolean;
  product: TProduct;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};


export type TCart = {
  id: number;
  items: TCartItem[];
  totalPrice: number;
};