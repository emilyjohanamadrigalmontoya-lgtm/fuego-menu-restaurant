import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CombosSection } from './components/CombosSection';
import { DiningExperienceSection } from './components/DiningExperienceSection';
import { PromotionsSection } from './components/PromotionsSection';
import { RestaurantInfoSection } from './components/RestaurantInfoSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderReviewModal } from './components/OrderReviewModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { Toast } from './components/Toast';

import {
  MenuItem,
  CartItem,
  ComboItem,
  OrderType,
  CustomerInfo,
  PaymentMethod,
  ConfirmedOrder,
  RestaurantConfig,
  CustomizationOption,
} from './types';

import {
  INITIAL_MENU_ITEMS,
  RESTAURANT_CONFIG,
  PROMOTIONS_DATA,
} from './data/restaurantData';

import { generateOrderNumber } from './utils/formatters';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Config & Menu Data State
  const [config, setConfig] = useState<RestaurantConfig>(RESTAURANT_CONFIG);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  // Cart & Pricing State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Modal Visibility States
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Pending Order Data for Review
  const [pendingOrderType, setPendingOrderType] = useState<OrderType>('delivery');
  const [pendingCustomerInfo, setPendingCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
    neighborhood: '',
  });
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<PaymentMethod>('cash');
  const [pendingCashGiven, setPendingCashGiven] = useState<number | undefined>(undefined);
  const [pendingSpecialKitchenNotes, setPendingSpecialKitchenNotes] = useState<string>('');

  // Confirmed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Cart total calculations
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const cartExtrasTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const itemExtras = item.selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
      return acc + itemExtras * item.quantity;
    }, 0);
  }, [cartItems]);

  const currentDeliveryFee = pendingOrderType === 'delivery' ? config.deliveryFee : 0;
  const currentTotal = Math.max(0, cartSubtotal + cartExtrasTotal + currentDeliveryFee - discountAmount);

  // Add Item to Cart handler
  const handleAddToCart = (
    product: MenuItem,
    quantity: number,
    selectedCustomizations: CustomizationOption[],
    removedIngredients: string[],
    kitchenNotes: string
  ) => {
    const extrasUnitCost = selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
    const itemSubtotal = (product.price + extrasUnitCost) * quantity;

    const newCartItem: CartItem = {
      cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product,
      quantity,
      selectedCustomizations,
      removedIngredients,
      kitchenNotes,
      itemSubtotal,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`✓ Added: ${product.name} (x${quantity})`);
  };

  // Quick Add handler from product card
  const handleQuickAdd = (product: MenuItem) => {
    handleAddToCart(product, 1, [], [], '');
  };

  // Open Details Modal
  const handleOpenDetails = (product: MenuItem) => {
    setActiveDetailItem(product);
    setIsDetailOpen(true);
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const extrasUnitCost = item.selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
          return {
            ...item,
            quantity: newQuantity,
            itemSubtotal: (item.product.price + extrasUnitCost) * newQuantity,
          };
        }
        return item;
      })
    );
  };

  // Remove Cart Item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Item removed from order');
  };

  // Add Combo to Cart
  const handleAddCombo = (combo: ComboItem, selectedItems: MenuItem[]) => {
    const comboProduct: MenuItem = {
      id: combo.id,
      name: `${combo.name}`,
      category: 'combos',
      sectionGroup: 'food',
      shortDescription: `${combo.tagline}: ${selectedItems.map((i) => i.name).join(' + ')}`,
      fullDescription: `${combo.description}. Includes: ${selectedItems.map((i) => i.name).join(', ')}.`,
      price: combo.price,
      image: combo.image,
      prepTimeMinutes: 25,
      portion: '1 Combo Experience',
      available: true,
      ingredients: selectedItems.map((i) => i.name),
      allergens: ['Check individual dish ingredients'],
    };

    const newCartItem: CartItem = {
      cartItemId: `${combo.id}-${Date.now()}`,
      product: comboProduct,
      quantity: 1,
      selectedCustomizations: selectedItems.map((item) => ({
        id: `inc-${item.id}`,
        name: item.name,
        price: 0,
        category: 'Combo Inclusions',
      })),
      removedIngredients: [],
      kitchenNotes: 'Combo served together',
      itemSubtotal: combo.price,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`✓ Combo added: ${combo.name}`);
    setIsCartOpen(true);
  };

  // Add Complete 5-course Dining Experience
  const handleAddExperience = (items: MenuItem[]) => {
    const expProduct: MenuItem = {
      id: 'dining-experience-5',
      name: 'FUEGO Sensorial Dining Experience (5 Courses)',
      category: 'combos',
      sectionGroup: 'food',
      shortDescription: 'Starter + Main Course + Side + Beverage + Dessert',
      fullDescription:
        '5-course culinary journey: Artisanal starter, Josper woodfire-aged prime cut, rustic side, signature craft cocktail, and flambéed dessert.',
      price: 185000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
      prepTimeMinutes: 35,
      portion: 'Tasting menu (Serves 2)',
      available: true,
      ingredients: items.map((i) => i.name),
      allergens: ['Contains dairy, gluten depending on selections'],
    };

    const newCartItem: CartItem = {
      cartItemId: `exp-${Date.now()}`,
      product: expProduct,
      quantity: 1,
      selectedCustomizations: items.map((i) => ({
        id: `inc-${i.id}`,
        name: i.name,
        price: 0,
        category: 'Experience Courses',
      })),
      removedIngredients: [],
      kitchenNotes: 'Serve in culinary course sequence',
      itemSubtotal: 185000,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    showToast('✓ 5-Course Sensorial Experience added to order!');
    setIsCartOpen(true);
  };

  // Apply Promotional Code
  const handleApplyPromoCode = (code: string) => {
    const found = PROMOTIONS_DATA.find((p) => p.code.toUpperCase() === code.toUpperCase());

    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }

    if (found.code === 'FUEGO10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount > 0 ? discount : 10000);
      setAppliedPromoCode(found.code);
      showToast('✓ FUEGO10 code applied: 10% discount');
      return {
        success: true,
        message: 'FUEGO10 code applied successfully! (10% discount on your order)',
      };
    }

    if (found.isBirthdayDessert) {
      setAppliedPromoCode(found.code);
      setDiscountAmount(26000); // Cost of Volcano dessert
      showToast('✓ FUEGO Birthday code applied: Complimentary dessert');
      return {
        success: true,
        message:
          'Birthday dessert activated! (Subject to restaurant terms & conditions)',
      };
    }

    if (found.code === '2X1GIN') {
      setAppliedPromoCode(found.code);
      setDiscountAmount(18000);
      showToast('✓ 2x1 Gin promo activated');
      return {
        success: true,
        message: '2x1 Signature Cocktails promotion applied!',
      };
    }

    return { success: true, message: `Code ${found.code} applied successfully.` };
  };

  // Proceed from Cart to Review Modal
  const handleProceedToReview = (
    orderType: OrderType,
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod,
    cashGiven: number | undefined,
    specialKitchenNotes: string
  ) => {
    setPendingOrderType(orderType);
    setPendingCustomerInfo(customerInfo);
    setPendingPaymentMethod(paymentMethod);
    setPendingCashGiven(cashGiven);
    setPendingSpecialKitchenNotes(specialKitchenNotes);

    setIsCartOpen(false);
    setIsReviewOpen(true);
  };

  // Confirm Order from Review Modal
  const handleConfirmOrder = () => {
    const newOrderNumber = generateOrderNumber();
    const orderObj: ConfirmedOrder = {
      orderNumber: newOrderNumber,
      orderType: pendingOrderType,
      customerInfo: pendingCustomerInfo,
      items: cartItems,
      subtotal: cartSubtotal,
      extrasTotal: cartExtrasTotal,
      discount: discountAmount,
      deliveryFee: currentDeliveryFee,
      total: currentTotal,
      paymentMethod: pendingPaymentMethod,
      cashGiven: pendingCashGiven,
      specialKitchenNotes: pendingSpecialKitchenNotes,
      status: 'ORDER RECEIVED',
      createdAt: new Date().toISOString(),
      estimatedTimeMin: 30,
    };

    setConfirmedOrder(orderObj);
    setIsReviewOpen(false);
    setIsConfirmationOpen(true);
    showToast(`✓ Order ${newOrderNumber} generated. Proceed to send via WhatsApp.`);
  };

  // Reset after order complete
  const handleNewOrder = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setAppliedPromoCode(null);
    setConfirmedOrder(null);
    setIsConfirmationOpen(false);
    showToast('New order started. Explore the menu!');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [activeSection, setActiveSection] = useState<string>('hero');

  return (
    <div className="min-h-screen bg-[#070506] text-zinc-100 font-sans selection:bg-[#e11d48] selection:text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Global Navigation Bar */}
      <Navbar
        config={config}
        cartItemCount={cartItemCount}
        cartTotal={currentTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={(secId) => {
          setActiveSection(secId);
          scrollToSection(secId);
        }}
      />

      {/* Hero Section */}
      <Hero
        config={config}
        onViewMenu={() => {
          setActiveSection('menu');
          scrollToSection('menu');
        }}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Combos & Experiences Section */}
      <CombosSection
        allItems={menuItems}
        onAddComboToOrder={handleAddCombo}
      />

      {/* Complete Dining Experience (5 Tiempos) */}
      <DiningExperienceSection
        allItems={menuItems}
        onAddExperience={handleAddExperience}
      />

      {/* Primary Interactive Menu Section */}
      <MenuSection
        items={menuItems}
        onOpenDetails={handleOpenDetails}
        onQuickAdd={handleQuickAdd}
        onCustomize={handleOpenDetails}
      />

      {/* Promotions & Promo Codes Section */}
      <PromotionsSection
        onApplyPromoCode={handleApplyPromoCode}
        appliedPromo={appliedPromoCode}
        onExploreMenu={() => scrollToSection('menu')}
      />

      {/* Restaurant Information, Location & Google Maps */}
      <RestaurantInfoSection
        config={config}
        onUpdateConfig={(newConfig) => {
          setConfig(newConfig);
          showToast('✓ Restaurant information updated');
        }}
      />

      {/* Floating Direct WhatsApp Action Button */}
      <aside aria-label="Direct WhatsApp contact" className="fixed bottom-6 right-6 z-40">
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${config.whatsAppDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-emerald-300/40 fire-glow-sm group"
          aria-label="Chat directly with Fuego Gastrobar on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-black/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-xl">
            WhatsApp FUEGO ({config.whatsAppNumber})
          </span>
        </a>
      </aside>

      {/* Product Detail & Customizer Modal */}
      <ProductDetailModal
        item={activeDetailItem}
        allItems={menuItems}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenPairing={(pairingItem) => {
          setActiveDetailItem(pairingItem);
        }}
      />

      {/* Cart Drawer & Price Breakdown */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onExploreMenu={() => scrollToSection('menu')}
        config={config}
        discountAmount={discountAmount}
        appliedPromoCode={appliedPromoCode}
        onProceedToReview={handleProceedToReview}
      />

      {/* Order Review Modal */}
      <OrderReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onEditOrder={() => {
          setIsReviewOpen(false);
          setIsCartOpen(true);
        }}
        onConfirmOrder={handleConfirmOrder}
        cartItems={cartItems}
        orderType={pendingOrderType}
        customerInfo={pendingCustomerInfo}
        paymentMethod={pendingPaymentMethod}
        cashGiven={pendingCashGiven}
        subtotal={cartSubtotal}
        extrasTotal={cartExtrasTotal}
        discount={discountAmount}
        appliedPromoCode={appliedPromoCode}
        deliveryFee={currentDeliveryFee}
        finalTotal={currentTotal}
        specialKitchenNotes={pendingSpecialKitchenNotes}
      />

      {/* Order Confirmed & WhatsApp Dispatcher Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        config={config}
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
}
