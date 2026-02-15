
export enum OrderStatus {
  AWAITING_PAYMENT = 'Aguardando Pagamento',
  PAID = 'Pago',
  ORDERED = 'Encomendado',
  IN_TRANSIT = 'Em Trânsito',
  ARRIVED = 'Chegou',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export enum PaymentStatus {
  NOT_PAID = 'Não Pago',
  PAID_BASE = 'Pago Base',
  PAID_TOTAL = 'Liquidado'
}

export enum Currency {
  ZAR = 'ZAR',
  USD = 'USD'
}

export enum PieceType {
  LIGHT_MEDIUM = 'Leve / Média',
  HEAVY = 'Pesada'
}

export interface AppSettings {
  marginPercentage: number;
  lightPieceTax: number;
  heavyPieceTax: number;
  zarRate: number;
  usdRate: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  originalPrice: number;
  currency: Currency;
  pieceType: PieceType;
  imageUrl?: string;
  
  // Calculated values
  convertedPriceMzn: number;
  pieceTaxMzn: number;
  baseCostMzn: number; // Converted + Piece Tax
  marginMzn: number;   // 50% of Base Cost
  totalMzn: number;    // Base Cost + Margin
  
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: number;
}
