import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Package,
  ShoppingCart,
  Warehouse,
  CreditCard,
  Award,
  MessageSquare,
  TrendingUp,
  Bell,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../Styles/Sidebar.css';

const menuSections = [
  {
    category: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    category: 'PROCUREMENT',
    items: [
      { id: 'vendors', label: 'Vendors', icon: Building2 },
      { id: 'contracts', label: 'Contracts', icon: FileText },
      { id: 'products', label: 'Products & Services', icon: Package },
      { id: 'purchaseorders', label: 'Purchase Orders', icon: ShoppingCart }
    ]
  },
  {
    category: 'OPERATIONS & FINANCE',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
      { id: 'payments', label: 'Invoices & Payments', icon: CreditCard }
    ]
  },
  {
    category: 'PERFORMANCE & CHAT',
    items: [
      { id: 'performance', label: 'Vendor Performance', icon: Award },
      { id: 'communication', label: 'Communication', icon: MessageSquare },
      { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp }
    ]
  },
  {
    category: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`crm-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="crm-brand">
        <div className="crm-brand-left">
          <span className="brand-icon">
            <Zap size={22} />
          </span>
          {!isCollapsed && <span className="brand-title">VendorCRM</span>}
        </div>
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed((prev) => !prev)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="crm-nav">
        {menuSections.map((section, idx) => (
          <div key={idx} className="nav-group">
            {!isCollapsed && (
              <span className="nav-group-title">{section.category}</span>
            )}
            <div className="nav-group-items">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  >
                    <span className="nav-icon">
                      <IconComponent size={18} />
                    </span>
                    {!isCollapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
