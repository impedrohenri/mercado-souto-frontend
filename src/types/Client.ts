import { TAddress } from "./Address";
import { TCart } from "./Cart";
import { TProduct } from "./Product";
import { TSeller } from "./Seller";
import { TUser } from "./User";




export type TClientResponse = {
  id: number;
  user: TUser;
  seller: TSeller | null;
  addresses: TAddress[];
  cart: TCart;
  orders: TOrder[];
  favoriteProducts: TProduct[];
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

// ===== Orders =====
export type TOrderStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'SHIPPED' | 'DELIVERED';

export type TOrderItem = {
  id: number;
  product: TProduct;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export type TOrder = {
  id: number;
  clientAddress: TAddress;
  orderItems: TOrderItem[];
  totalPrice: number;
  status: TOrderStatus;
  createdAt: string; // ISO date
}