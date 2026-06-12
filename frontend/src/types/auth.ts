export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'approver' | 'requester';
  active: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
