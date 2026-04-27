// src/components/ui/Tag/Tag.jsx
const variantStyles = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  accent: 'bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20',
  accentSoft: 'bg-brand-light text-brand-primary dark:bg-brand-primary/20',
  info: 'bg-gray-900 text-white dark:bg-gray-700',
  muted: 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
};

const Tag = ({ children, variant = 'default', className = '', ...props }) => {
  return (
    <span 
      className={`
        inline-flex items-center rounded-full px-3 py-1 
        text-xs font-bold uppercase tracking-[0.12em] text-center
        transition-all duration-200
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;