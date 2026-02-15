
import React, { useState, useMemo } from 'react';
import { Currency, PieceType, AppSettings, Order, OrderStatus, PaymentStatus } from '../types';
import { calculateOrderValues, formatCurrency, generateWhatsAppSummary } from '../utils/calculations';

interface OrderFormProps {
  settings: AppSettings;
  onSave: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    originalPrice: 0,
    currency: Currency.ZAR,
    pieceType: PieceType.LIGHT_MEDIUM,
    paymentStatus: PaymentStatus.NOT_PAID,
  });

  const calculation = useMemo(() => {
    return calculateOrderValues(
      formData.originalPrice,
      formData.currency,
      formData.pieceType,
      settings
    );
  }, [formData.originalPrice, formData.currency, formData.pieceType, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) return alert('Insira o nome do cliente');

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      ...calculation,
      status: formData.paymentStatus === PaymentStatus.NOT_PAID ? OrderStatus.AWAITING_PAYMENT : OrderStatus.PAID,
      createdAt: Date.now(),
    };
    onSave(newOrder);
    setFormData({
      customerName: '',
      phone: '',
      originalPrice: 0,
      currency: Currency.ZAR,
      pieceType: PieceType.LIGHT_MEDIUM,
      paymentStatus: PaymentStatus.NOT_PAID,
    });
  };

  const copyToClipboard = () => {
    const tempOrder = { ...formData, ...calculation, id: 'temp', status: OrderStatus.PAID, createdAt: Date.now() } as Order;
    navigator.clipboard.writeText(generateWhatsAppSummary(tempOrder));
    alert('Copiado!');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
      <header className="px-2">
        <h2 className="text-3xl font-bold tracking-tight">Novo Registro</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Group */}
        <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#F2F2F7]">
            <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-1 ml-1">Cliente</label>
            <input
              type="text"
              className="w-full bg-transparent outline-none text-lg font-medium placeholder:text-[#C7C7CC]"
              placeholder="Nome do cliente"
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div className="p-4">
            <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-1 ml-1">Contato</label>
            <input
              type="tel"
              className="w-full bg-transparent outline-none text-lg font-medium placeholder:text-[#C7C7CC]"
              placeholder="+258..."
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        {/* Pricing Group */}
        <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm overflow-hidden divide-y divide-[#F2F2F7]">
          <div className="p-4 flex justify-between items-center">
            <label className="text-sm font-semibold">Preço SHEIN</label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                className="w-24 text-right bg-transparent outline-none font-bold text-xl"
                placeholder="0.00"
                value={formData.originalPrice || ''}
                onChange={e => setFormData({...formData, originalPrice: parseFloat(e.target.value) || 0})}
              />
              <span className="ml-2 font-bold text-[#8E8E93]">{formData.currency}</span>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            <label className="text-sm font-semibold">Moeda Original</label>
            <select
              className="bg-transparent outline-none font-bold text-violet-600 appearance-none text-right px-2"
              value={formData.currency}
              onChange={e => setFormData({...formData, currency: e.target.value as Currency})}
            >
              <option value={Currency.ZAR}>ZAR (Rand)</option>
              <option value={Currency.USD}>USD (Dólar)</option>
            </select>
          </div>
          <div className="p-4 flex justify-between items-center">
            <label className="text-sm font-semibold">Tipo de Encomenda</label>
            <select
              className="bg-transparent outline-none font-bold text-violet-600 appearance-none text-right px-2"
              value={formData.pieceType}
              onChange={e => setFormData({...formData, pieceType: e.target.value as PieceType})}
            >
              <option value={PieceType.LIGHT_MEDIUM}>Leve / Média</option>
              <option value={PieceType.HEAVY}>Peça Pesada</option>
            </select>
          </div>
        </div>

        {/* Result Highlight Card */}
        <div className="bg-[#1C1C1E] rounded-[2rem] p-8 text-white shadow-lg space-y-6">
          <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Preço Base</span>
              <p className="text-2xl font-bold">{formatCurrency(calculation.baseCostMzn)}</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Taxa 50%</span>
              <p className="text-2xl font-bold text-violet-400">{formatCurrency(calculation.marginMzn)}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-30 mb-1">Valor Total a Cobrar</span>
            <p className="text-5xl font-black tracking-tighter">{formatCurrency(calculation.totalMzn)}</p>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-3xl border border-[#D1D1D6] p-4 shadow-sm">
          <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-4 ml-1">Recebeu Pagamento?</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: PaymentStatus.NOT_PAID, label: 'Não', icon: 'fa-x' },
              { id: PaymentStatus.PAID_BASE, label: 'Base', icon: 'fa-check' },
              { id: PaymentStatus.PAID_TOTAL, label: 'Total', icon: 'fa-check-double' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormData({...formData, paymentStatus: item.id})}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  formData.paymentStatus === item.id 
                    ? 'bg-violet-600 text-white shadow-md scale-105' 
                    : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'
                }`}
              >
                <i className={`fas ${item.icon} mb-2`}></i>
                <span className="text-[10px] font-bold uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-violet-600 text-white font-bold py-5 rounded-2xl shadow-md active:scale-[0.98] transition-all text-lg"
          >
            Registrar Pedido
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            className="md:w-32 bg-[#34C759] text-white font-bold py-5 rounded-2xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
