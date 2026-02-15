
import React from 'react';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/calculations';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const stats = React.useMemo(() => {
    const received = orders
      .filter(o => [OrderStatus.PAID, OrderStatus.ORDERED, OrderStatus.IN_TRANSIT, OrderStatus.ARRIVED, OrderStatus.DELIVERED].includes(o.status))
      .reduce((acc, o) => acc + o.baseCostMzn, 0);

    const pending = orders
      .filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED)
      .reduce((acc, o) => acc + o.marginMzn, 0);

    const profit = orders
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((acc, o) => acc + o.marginMzn, 0);

    const active = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length;

    return { received, pending, profit, active };
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="px-2">
        <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">Outfit Empire Manager</p>
        <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
      </header>

      {/* Stats Section - iOS Widget Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#D1D1D6] shadow-sm flex flex-col justify-between min-h-[160px]">
          <span className="text-sm font-semibold text-[#8E8E93]">Total em Caixa</span>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tighter">{formatCurrency(stats.received)}</h3>
            <p className="text-xs text-[#34C759] font-medium">+8% este mês</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-[#D1D1D6] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#8E8E93]">Lucro Real</span>
            <h3 className="text-lg font-bold tracking-tight text-violet-600">{formatCurrency(stats.profit)}</h3>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-[#D1D1D6] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#8E8E93]">Ativos</span>
            <h3 className="text-lg font-bold tracking-tight">{stats.active}</h3>
          </div>
          <div className="col-span-2 bg-[#1C1C1E] p-4 rounded-3xl shadow-md flex justify-between items-center text-white">
            <span className="text-xs font-semibold opacity-60">Margem Pendente</span>
            <h3 className="text-lg font-bold tracking-tight">{formatCurrency(stats.pending)}</h3>
          </div>
        </div>
      </div>

      {/* Recent List - iOS Table Style */}
      <div className="space-y-4">
        <h3 className="px-2 text-sm font-bold text-[#8E8E93] uppercase tracking-wider">Atividade Recente</h3>
        <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-[#8E8E93] text-sm italic">Nenhum pedido recente</div>
          ) : (
            <div className="divide-y divide-[#D1D1D6]">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#F2F2F7] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center text-xs">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{order.customerName}</p>
                      <p className="text-[10px] text-[#8E8E93] font-medium uppercase">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(order.totalMzn)}</p>
                    <p className="text-[10px] text-[#C7C7CC]">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
