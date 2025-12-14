import { TAddress } from '@/types/Address';
import { email, string } from 'zod';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface IClientState {
  name: string | null,
  email: string | null,
  addresses: TAddress[] | null,
}

export const useAuthStore = create<IClientState>()(
  persist(
    (set) => ({
      name: null,
      email: null,
      addresses: null,

      setName: (data: IClientState) => {
        set({
          name: data.name,
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
