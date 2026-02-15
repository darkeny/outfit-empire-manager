
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Settings from './components/Settings';
import { Order, OrderStatus, AppSettings, PaymentStatus } from './types';
import { DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('outfit_empire_orders_simple');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('outfit_empire_settings_simple');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('outfit_empire_orders_simple', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('outfit_empire_settings_simple', JSON.stringify(settings));
  }, [settings]);

  // Handlers
  const handleSaveOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveTab('orders');
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleUpdatePayment = (id: string, paymentStatus: PaymentStatus) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        // Automatically sync simple status logic
        let newStatus = o.status;
        if (paymentStatus === PaymentStatus.NOT_PAID) newStatus = OrderStatus.AWAITING_PAYMENT;
        else if (o.status === OrderStatus.AWAITING_PAYMENT) newStatus = OrderStatus.PAID;
        
        return { ...o, paymentStatus, status: newStatus };
      }
      return o;
    }));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        {activeTab === 'dashboard' && <Dashboard orders={orders} />}
        
        {activeTab === 'new-order' && (
          <OrderForm 
            settings={settings} 
            onSave={handleSaveOrder} 
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderList 
            orders={orders} 
            onUpdateStatus={handleUpdateStatus} 
            onUpdatePayment={handleUpdatePayment}
            onDelete={handleDeleteOrder} 
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            onSave={handleUpdateSettings} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
