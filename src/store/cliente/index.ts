import { TAddress } from '@/types/Address';
import { email, string } from 'zod';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface IClientState {
  name: string | null,
  email: string | null,
  addresses: TAddress[] | null,
  setName: (name: string) => void,
  setEmail: (email: string) => void,
}

export const useClienteStore = create<IClientState>()(
  persist(
    (set) => ({
      name: null,
      email: null,
      addresses: null,

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
          addresses: null
        }),
    }),
    {
      name: 'client',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
