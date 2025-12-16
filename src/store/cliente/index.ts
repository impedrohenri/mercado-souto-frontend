import { TAddress } from '@/types/Address';
import { TCart } from '@/types/Cart';
import { TClientResponse } from '@/types/Client';
import { email, string } from 'zod';
import { ca } from 'zod/v4/locales';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface IClientActions {
  client: TClientResponse | null;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setClient: (clientData: TClientResponse) => void;
  setCart: (cartData: TCart) => void;
  clearClient: () => void;
}

type TClientStore = TClientResponse & IClientActions;

export const useClienteStore = create<TClientStore>()(
  persist(
    (set) => ({
      id: null,
      user: null,
      seller: null,
      addresses: [],
      cart: null,
      orders: [],
      favoriteProducts: [],
      name: "",
      email: "",
      cpf: "",
      phone: "",
      client: null,

      setClient: (clientData: TClientResponse) => {
        set({
          client: clientData,
          ...clientData
        });
      },

      setName: (name: string) => {
        set({
          name: name
        });
      },

      setEmail: (email: string) => {
        set({
          email: email,
        });
      },

      setCart: (cartData: TCart) => {
        set({
          cart: cartData
        });
      },

      clearClient: () =>
        set({
          client: null,
          name: null,
          email: null,
          addresses: [],
          cart: null,
          orders: [],
          favoriteProducts: [],
          cpf: null,
          phone: null,
          id: null,
          user: null,
          seller: null,
        }),
    }),
    {
      name: 'client',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
