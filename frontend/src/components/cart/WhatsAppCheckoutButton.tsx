'use client';

import { useCart } from '@/store/use-cart';
import { ShoppingBag } from 'lucide-react';

export const WhatsAppCheckoutButton = () => {
  const { items, totalPrice } = useCart();
  
  const handleCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '910000000000';
    
    let message = `*Vastraya Order Request*

`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.selectedSize}) x ${item.quantity} - ₹${(item.sale_price || item.price) * item.quantity}
`;
    });
    
    message += `
*Total Amount: ₹${totalPrice()}*`;
    message += `

Please confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={items.length === 0}
      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
    >
      <ShoppingBag size={20} />
      <span>Checkout via WhatsApp</span>
    </button>
  );
};
