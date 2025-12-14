// ===== Auth / User =====
export type TAuthority = {
  authority: string;
}

export type TUser = {
  id: number;
  username: string;
  authorities: TAuthority[];
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  enabled: boolean;
}
