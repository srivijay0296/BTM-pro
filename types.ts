
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  FROZEN = 'FROZEN'
}

export enum PlanType {
  NONE = 'NONE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionStatus: SubscriptionStatus;
  planType: PlanType;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isFrozenByAdmin: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
