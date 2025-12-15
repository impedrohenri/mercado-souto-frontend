import { TAddress } from '@/types/Address';
import { TCart } from '@/types/Cart';
import { TClientResponse } from '@/types/Client';
import { email, string } from 'zod';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface IClientActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setClient: (clientData: TClientResponse) => void;
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

      setClient: (clientData: TClientResponse) => {
        set({
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

      clearClient: () =>
        set({
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
