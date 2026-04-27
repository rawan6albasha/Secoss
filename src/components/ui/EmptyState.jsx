// src/components/ui/EmptyState.jsx
const EmptyState = ({ message, actionText, onAction, icon = '📭' }) => (
  <div className="py-16 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <p className="text-slate-500 font-bold mb-2">{message}</p>
    {actionText && onAction && (
      <button 
        onClick={onAction}
        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;