import { CartItem, ConfirmedOrder, CustomerInfo, OrderType, PaymentMethod, RestaurantConfig } from '../types';

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount) + ' COP';
}

export function generateOrderNumber(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FUEGO #${randomLetter}${randomNum}`;
}

export function getOrderTypeLabel(type: OrderType): string {
  switch (type) {
    case 'dine_in':
      return 'Dine-In (Table)';
    case 'takeaway':
      return 'Takeaway (Pickup)';
    case 'delivery':
      return 'Delivery';
    case 'curbside':
      return 'Curbside Pickup';
    case 'drive_thru':
      return 'Drive-Thru';
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'bank_transfer':
      return 'Bank Transfer (Bancolombia / Nequi)';
    case 'card':
      return 'Debit / Credit Card (Card Terminal)';
  }
}

export function buildWhatsAppMessage(
  order: ConfirmedOrder,
  config: RestaurantConfig
): string {
  const lines: string[] = [];

  lines.push(`🔥 *${config.name.toUpperCase()}*`);
  lines.push(`Order: *${order.orderNumber}*`);
  lines.push(`Order Type: ${getOrderTypeLabel(order.orderType)}`);

  if (order.orderType === 'dine_in') {
    lines.push(`Table: Table #${order.customerInfo.tableNumber || 'Unspecified'}`);
    if (order.customerInfo.fullName) lines.push(`Customer: ${order.customerInfo.fullName}`);
    if (order.customerInfo.phone) lines.push(`Phone: ${order.customerInfo.phone}`);
  } else if (order.orderType === 'takeaway') {
    lines.push(`Customer: ${order.customerInfo.fullName}`);
    lines.push(`Phone: ${order.customerInfo.phone}`);
  } else {
    // delivery or curbside
    lines.push(`Customer: ${order.customerInfo.fullName}`);
    lines.push(`Phone: ${order.customerInfo.phone}`);
    lines.push(`Address: ${order.customerInfo.address || 'N/A'}`);
    if (order.customerInfo.neighborhood) {
      lines.push(`Neighborhood: ${order.customerInfo.neighborhood}`);
    }
    if (order.customerInfo.locationReference) {
      lines.push(`Reference: ${order.customerInfo.locationReference}`);
    }
  }

  lines.push('');
  lines.push('Products:');

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.product.name} × ${item.quantity}`);
    
    // Customizations (extras)
    if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
      item.selectedCustomizations.forEach((custom) => {
        const priceStr = custom.price > 0 ? ` (+${formatCOP(custom.price)})` : ' (Included)';
        lines.push(`   * ${custom.name}${priceStr}`);
      });
    }

    // Removals
    if (item.removedIngredients && item.removedIngredients.length > 0) {
      item.removedIngredients.forEach((rem) => {
        lines.push(`   * Without ${rem}`);
      });
    }

    if (item.kitchenNotes) {
      lines.push(`   * Note: ${item.kitchenNotes}`);
    }

    lines.push(`   * ${formatCOP(item.itemSubtotal)}`);
  });

  lines.push('');
  lines.push(`Subtotal: ${formatCOP(order.subtotal)}`);
  if (order.extrasTotal > 0) {
    lines.push(`Extras: ${formatCOP(order.extrasTotal)}`);
  }
  if (order.discount > 0) {
    lines.push(`Discount: -${formatCOP(order.discount)} ${order.appliedPromoCode ? `(${order.appliedPromoCode})` : ''}`);
  }
  if (order.orderType === 'delivery') {
    lines.push(`Delivery: ${formatCOP(order.deliveryFee)}`);
  }
  lines.push(`*TOTAL: ${formatCOP(order.total)}*`);
  lines.push('');
  lines.push(`Payment: ${getPaymentMethodLabel(order.paymentMethod)}`);

  if (order.paymentMethod === 'cash') {
    if (order.cashGiven && order.cashGiven > 0) {
      lines.push(`Cash amount: ${formatCOP(order.cashGiven)}`);
      const change = Math.max(0, order.cashGiven - order.total);
      lines.push(`Change: ${formatCOP(change)}`);
    }
  }

  if (order.specialKitchenInstructions && order.specialKitchenInstructions.trim().length > 0) {
    lines.push('');
    lines.push(`Special instructions: ${order.specialKitchenInstructions.trim()}`);
  }

  lines.push('');
  lines.push('🔥 _Sent from FUEGO Gastrobar Digital Menu_');

  return lines.join('\n');
}

export function buildWhatsAppUrl(
  phoneNumberDigits: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumberDigits}?text=${encoded}`;
}
