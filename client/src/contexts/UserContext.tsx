import React from 'react';
import { User } from '../types';

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  updateUser: async () => {},
});
