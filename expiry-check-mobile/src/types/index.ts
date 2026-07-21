export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  productId: number;
  productName: string;
  thumbnail: string;
  type: RiskLevel;
  message: string;
  daysRemaining: number;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: RiskLevel;
  completed: boolean;
  assignedTo: string;
  dueTime: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'alert' | 'task' | 'system';
  read: boolean;
  timestamp: string;
}
