
import { Order, Currency, PieceType, AppSettings, PaymentStatus } from '../types';

export const calculateOrderValues = (
  originalPrice: number,
  currency: Currency,
  pieceType: PieceType,
  settings: AppSettings
) => {
  const rate = currency === Currency.ZAR ? settings.zarRate : settings.usdRate;
  const convertedPriceMzn = originalPrice * rate;
  
  const pieceTaxMzn = pieceType === PieceType.LIGHT_MEDIUM 
    ? settings.lightPieceTax 
    : settings.heavyPieceTax;
  
  // O "Preço Base" é a soma da conversão + taxa da peça
  const baseCostMzn = convertedPriceMzn + pieceTaxMzn;
  
  // A margem de lucro (Taxa 50%) é calculada sobre o Preço Base
  const marginMzn = baseCostMzn * (settings.marginPercentage / 100);
  
  // O Total Final é o Preço Base + Lucro
  const totalMzn = baseCostMzn + marginMzn;

  return {
    convertedPriceMzn,
    pieceTaxMzn,
    baseCostMzn,
    marginMzn,
    totalMzn
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
  }).format(value);
};

export const generateWhatsAppSummary = (order: Order) => {
  const paidAmount = order.paymentStatus === PaymentStatus.PAID_TOTAL 
    ? order.totalMzn 
    : order.paymentStatus === PaymentStatus.PAID_BASE 
      ? order.baseCostMzn 
      : 0;
  
  const balance = order.totalMzn - paidAmount;

  return `Pedido – Outfit Empire 🛍️

Preço Base: ${formatCurrency(order.baseCostMzn)}
Taxa (${order.marginMzn > 0 ? '50%' : '0%'}): ${formatCurrency(order.marginMzn)}
Total: ${formatCurrency(order.totalMzn)}

Pago: ${formatCurrency(paidAmount)}
Saldo: ${formatCurrency(balance)}

Prazo: 14–19 dias úteis`;
};
