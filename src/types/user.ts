export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role:'admin'|'user';
}

export interface dataRegisterUser {
 
  name: string;
  email: string;
  password: string;
  role?: 'admin'|'user';
}