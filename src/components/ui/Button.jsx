// src/components/ui/Button/Button.jsx
import { Link as RouterLink } from 'react-router-dom'

// === أنماط الأزرار المحسّنة للجمعية الخيرية ===
const variantStyles = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primaryHover focus:ring-brand-primary/30',
  secondary: 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-brand-primary focus:ring-brand-primary/30',
  accent: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 focus:ring-emerald-300',
  accentSoft: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-200',
  ghost: 'text-slate-600 hover:text-brand-primary hover:bg-slate-50 focus:ring-slate-300',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
}

const Button = ({ 
  children, 
  to, 
  href, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  isLoading = false,
  icon: Icon,
  iconPosition = 'start', // 'start' | 'end'
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-2xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${fullWidth ? 'w-full' : ''}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `

  const Content = () => (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon && iconPosition === 'start' && <Icon size={18} />}
      
      <span>{children}</span>
      
      {Icon && iconPosition === 'end' && <Icon size={18} />}
    </>
  )

  if (to) {
    return (
      <RouterLink to={to} className={baseClasses} {...props}>
        <Content />
      </RouterLink>
    )
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        <Content />
      </a>
    )
  }

  return (
    <button type="button" className={baseClasses} {...props}>
      <Content />
    </button>
  )
}

export default Button