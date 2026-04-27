// components/ui/StatsGrid.jsx
import { FaEye, FaDownload, FaSearch, FaChartBar } from 'react-icons/fa';

const StatsGrid = ({ stats }) => {
  const items = [
    { label: "زيارات البروفايل", value: stats.views, icon: FaEye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "تحميلات الملفات", value: stats.downloads, icon: FaDownload, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "ظهور في البحث", value: stats.searchHits, icon: FaSearch, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "معدل التفاعل", value: stats.engagement, icon: FaChartBar, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item, i) => (
        <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-soft flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
            <item.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-xl font-bold text-slate-800">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default StatsGrid