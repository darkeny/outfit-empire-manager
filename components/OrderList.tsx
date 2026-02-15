
import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { formatCurrency, generateWhatsAppSummary } from '../utils/calculations';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdatePayment: (id: string, payment: PaymentStatus) => void;
  onDelete: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus, onUpdatePayment, onDelete }) => {
  const [filter, setFilter] = useState('');

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusTag = (status: OrderStatus) => {
    const style = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ";
    switch (status) {
      case OrderStatus.AWAITING_PAYMENT: return style + 'bg-amber-100 text-amber-600';
      case OrderStatus.PAID: return style + 'bg-blue-100 text-blue-600';
      case OrderStatus.DELIVERED: return style + 'bg-slate-100 text-slate-400';
      default: return style + 'bg-violet-100 text-violet-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="px-2 flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <div className="relative">
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-48 rounded-2xl bg-[#E5E5EA] border-none text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            placeholder="Buscar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-xs"></i>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-[#D1D1D6]">
            <p className="text-[#8E8E93] text-sm font-medium italic">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-[2rem] border border-[#D1D1D6] shadow-sm overflow-hidden flex flex-col hover:border-violet-300 transition-all">
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-none">{order.customerName}</h3>
                  <p className="text-xs text-[#8E8E93] font-medium">{order.phone || 'Sem telefone'}</p>
                </div>
                <div className={getStatusTag(order.status)}>
                  {order.status}
                </div>
              </div>

              <div className="px-6 py-2 space-y-3">
                <div className="bg-[#F2F2F7] p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(order.totalMzn)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="bg-white text-[11px] font-bold text-slate-800 outline-none py-3 px-3 rounded-xl border border-[#D1D1D6] cursor-pointer appearance-none"
                    value={order.paymentStatus}
                    onChange={e => onUpdatePayment(order.id, e.target.value as PaymentStatus)}
                  >
                    {Object.values(PaymentStatus).map(ps => <option key={ps} value={ps}>{ps}</option>)}
                  </select>
                  <select 
                    className="bg-white text-[11px] font-bold text-slate-800 outline-none py-3 px-3 rounded-xl border border-[#D1D1D6] cursor-pointer appearance-none"
                    value={order.status}
                    onChange={e => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                  >
                    {Object.values(OrderStatus).map(os => <option key={os} value={os}>{os}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#F8F8FA] border-t border-[#D1D1D6] mt-4 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateWhatsAppSummary(order));
                    alert('Copiado!');
                  }}
                  className="flex-1 bg-white border border-[#D1D1D6] text-[#34C759] font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 active:bg-[#F2F2F7]"
                >
                  <i className="fab fa-whatsapp"></i> RESUMO
                </button>
                <button
                  onClick={() => confirm('Apagar permanentemente?') && onDelete(order.id)}
                  className="w-12 h-10 bg-white border border-[#D1D1D6] text-[#FF3B30] rounded-xl flex items-center justify-center transition-all active:bg-[#FF3B30] active:text-white"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
