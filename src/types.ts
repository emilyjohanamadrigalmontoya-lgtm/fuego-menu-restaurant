export type MenuCategoryType =
  | 'starters'
  | 'main-courses'
  | 'gourmet-burgers'
  | 'bowls'
  | 'pasta'
  | 'meats'
  | 'chicken'
  | 'seafood'
  | 'salads'
  | 'side-dishes'
  | 'sauces-extras'
  | 'desserts'
  | 'cocktails'
  | 'mocktails'
  | 'natural-drinks'
  | 'lemonades'
  | 'soft-drinks'
  | 'coffee'
  | 'hot-beverages'
  | 'other-drinks'
  | 'combos';

export type MenuSectionGroup = 'food' | 'beverages';

export type ProductBadge = 'NEW' | 'POPULAR' | 'RECOMMENDED' | "CHEF'S CHOICE" | 'PROMOTION';

export type Allergen =
  | 'Gluten'
  | 'Dairy'
  | 'Eggs'
  | 'Nuts'
  | 'Peanuts'
  | 'Soy'
  | 'Fish'
  | 'Shellfish'
  | string;

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // in COP (0 if included)
  category?: 'cheese' | 'protein' | 'toppings' | 'sauces' | 'sides' | 'extras' | string;
}

export interface IngredientOption {
  id: string;
  name: string;
  removable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // in COP
  image: string;
  category: MenuCategoryType;
  sectionGroup: MenuSectionGroup;
  portion: string;
  prepTimeMinutes: number;
  available: boolean;
  badges?: ProductBadge[];
  ingredients: string[];
  removableIngredients?: string[];
  customizationGroups?: {
    groupName: string;
    options: CustomizationOption[];
  }[];
  nutrition?: NutritionInfo | null;
  allergens?: Allergen[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  spicyLevel?: 1 | 2 | 3;
  pairingIds?: string[];
  pairingReason?: string;
  flavorProfile?: {
    intensity: 'Mild' | 'Medium' | 'High' | 'Intense Flame';
    notes: string[];
  };
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  option: CustomizationOption;
}

export interface CartItem {
  cartItemId: string;
  product: MenuItem;
  quantity: number;
  selectedCustomizations: CustomizationOption[];
  removedIngredients: string[];
  kitchenNotes?: string;
  itemSubtotal: number;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery' | 'curbside' | 'drive_thru';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  tableNumber?: string;
  address?: string;
  neighborhood?: string;
  locationReference?: string;
  additionalNotes?: string;
}

export interface ComboItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  available: boolean;
  categoryOptions: {
    slotName: string;
    category: MenuCategoryType;
    allowedItemIds?: string[];
  }[];
}

export interface RestaurantConfig {
  name: string;
  slogan: string;
  brandStatement: string;
  location: string;
  address: string;
  phone: string;
  whatsAppNumber: string; // e.g. "+57 311 279 4447"
  whatsAppDigits: string; // "573112794447"
  email: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  deliveryFee: number;
  enableCurbside: boolean;
  enableDriveThru: boolean;
}

export type OrderStatus =
  | 'ORDER RECEIVED'
  | 'PREPARING'
  | 'READY'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED';

export interface ConfirmedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  extrasTotal: number;
  discount: number;
  appliedPromoCode?: string;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  changeDue?: number;
  specialKitchenInstructions?: string;
  specialKitchenNotes?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedTimeMin: number;
}
