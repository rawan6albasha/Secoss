import { FaCheck, FaTimes } from 'react-icons/fa';

const PendingPosts = ({ items, onApprove, onReject }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-6" dir="rtl">
      <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
        <span className="flex h-3 w-3 rounded-full bg-amber-500"></span>
        طلبات بانتظار المراجعة ({items.length})
      </h3>
      <div className="grid gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="text-right">
              <span className="text-[10px] font-bold text-accent bg-accent/5 px-2 py-1 rounded-md uppercase">{item.type}</span>
              <h4 className="font-bold text-slate-900 mt-1">{item.title}</h4>
              <p className="text-xs text-slate-500">بواسطة: {item.authorName}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onApprove(item.id)} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"><FaCheck/></button>
              <button onClick={() => onReject(item.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"><FaTimes/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPosts;