
import { User, UserRole, SubscriptionStatus, PlanType, Product } from '../types';
import { TRIAL_DAYS } from '../constants';

const USERS_KEY = 'btm_users';
const CURRENT_USER_KEY = 'btm_current_user';
const PRODUCTS_KEY = 'btm_products';

// Helper to initialize Admin
const initAdmin = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!users.find((u: User) => u.email === 'admin@btm.com')) {
    const admin: User = {
      id: 'admin_1',
      fullName: 'System Admin',
      email: 'admin@btm.com',
      mobileNumber: '9999999999',
      role: UserRole.ADMIN,
      trialStartDate: new Date().toISOString(),
      trialEndDate: new Date(Date.now() + 1000 * TRIAL_DAYS * 24 * 60 * 60).toISOString(),
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      planType: PlanType.YEARLY,
      isFrozenByAdmin: false
    };
    users.push(admin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

initAdmin();

export const getSessionUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  if (!user) return null;
  
  const parsedUser: User = JSON.parse(user);
  
  // Real-time check for trial/subscription expiry
  const now = new Date();
  const trialEnd = new Date(parsedUser.trialEndDate);
  const subEnd = parsedUser.subscriptionEndDate ? new Date(parsedUser.subscriptionEndDate) : null;
  
  let updatedStatus = parsedUser.subscriptionStatus;

  if (parsedUser.role !== UserRole.ADMIN) {
    if (parsedUser.subscriptionStatus === SubscriptionStatus.ACTIVE && subEnd && now > subEnd) {
      updatedStatus = SubscriptionStatus.EXPIRED;
    } else if (parsedUser.subscriptionStatus === SubscriptionStatus.TRIAL && now > trialEnd) {
      updatedStatus = SubscriptionStatus.EXPIRED;
    }
  }

  if (updatedStatus !== parsedUser.subscriptionStatus) {
    parsedUser.subscriptionStatus = updatedStatus;
    updateUserInStore(parsedUser);
  }

  return parsedUser;
};

export const updateUserInStore = (updatedUser: User) => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Also update session if it's the current user
    const current = localStorage.getItem(CURRENT_USER_KEY);
    if (current && JSON.parse(current).id === updatedUser.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  }
};

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getProducts = (): Product[] => {
  const prods = localStorage.getItem(PRODUCTS_KEY);
  return prods ? JSON.parse(prods) : [
    {
      id: 'p1',
      sellerId: 's1',
      name: 'Premium Cotton Roll',
      price: 450,
      category: 'Cotton',
      description: 'High quality 100% pure cotton for manufacturing.',
      imageUrl: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 'p2',
      sellerId: 's1',
      name: 'Synthetic Silk Blend',
      price: 800,
      category: 'Silk',
      description: 'Lustrous silk blend for ethnic wear.',
      imageUrl: 'https://picsum.photos/400/300?random=2'
    }
  ];
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const products = getProducts();
  const newProduct = { ...product, id: `prod_${Date.now()}` };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};
