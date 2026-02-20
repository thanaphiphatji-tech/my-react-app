import { Home, Calendar, FileText, User, Plus } from 'lucide-react';

const BottomNav = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: Calendar, type: 'normal' },
    { id: 'requests', label: 'Request', icon: Plus, type: 'normal' },
    { id: 'home', label: 'Home', icon: Home, type: 'center' },
    { id: 'payroll', label: 'Payroll', icon: FileText, type: 'normal' },
    { id: 'profile', label: 'Profile', icon: User, type: 'normal' }
  ];

  return (
    <nav className="shrink-0 bg-[#111827]/95 border-t border-white/5 px-2 pb-6 pt-2 flex justify-around items-center">
      {tabs.map(({ id, label, icon: Icon, type }) => {
        const isActive = activeTab === id;

        // ปุ่ม Home ตรงกลาง
        if (type === 'center') {
          return (
            <div key={id} className="w-1/5 flex justify-center -mt-6">
              <button
                onClick={() => onChangeTab(id)}
                className={`p-3 rounded-xl shadow-xl transition-all duration-300
                  ${
                    isActive
                      ? 'bg-[#46bdc6] text-[#111827] scale-110'
                      : 'bg-gray-800 text-gray-400'
                  }
                `}
              >
                <Icon size={22} />
              </button>
            </div>
          );
        }

        // ปุ่มทั่วไป
        return (
          <button
            key={id}
            onClick={() => onChangeTab(id)}
            className={`flex flex-col items-center gap-1 w-1/5 transition-colors
              ${isActive ? 'text-[#46bdc6]' : 'text-gray-500'}
            `}
          >
            <Icon size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
