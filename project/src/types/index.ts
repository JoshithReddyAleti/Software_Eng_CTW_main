export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  favorites: string[];
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  sqft: number;
  age: number;
  image: string;
  description: string;
  type: 'house' | 'apartment' | 'condo' | 'villa';
  status: 'available' | 'sold' | 'pending';
  sellerId: string;
  features: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'favorites' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  minSqft: number;
  maxSqft: number;
  maxAge: number;
  type: string;
}