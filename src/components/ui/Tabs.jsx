import { motion } from 'framer-motion'  // ✅ هذا السطر كان ناقصاً!
export const Tabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`pb-4 text-sm font-bold transition-all relative ${
          activeTab === tab.id ? 'text-accent' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-1 bg-accent rounded-full" />
        )}
      </button>
    ))}
  </div>
);