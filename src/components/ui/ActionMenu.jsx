// src/components/ui/ActionMenu/ActionMenu.jsx
import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaEllipsisH } from 'react-icons/fa';
import i18n from '../../i18n/config';

const ActionMenu = ({
  actions = [],
  triggerIcon = FaEllipsisH,
  triggerClassName = '',
  menuPosition = 'right', // 'left' | 'right' | 'center'
  menuAlign = 'bottom',   // 'top' | 'bottom'
  zIndex = 99999,
  onClose,
  onOpen,
  disabled = false,
  tooltip = '',
  menuClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  
  const currentLang = i18n?.language || document.documentElement.lang || 'ar';
  const isRTL = currentLang === 'ar' || document.documentElement.dir === 'rtl';

  // === حساب الموقع الديناميكي الذكي ===
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;

    const calculatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuEl = menuRef.current;
      if (!menuEl) return;

      const menuWidth = menuEl.offsetWidth || 280;
      const menuHeight = menuEl.offsetHeight || 100;
      const gap = 8;
      const padding = 16; // هامش أمان لمنع الالتصاق بالحافة

      // 1. الاتجاه العمودي
      let top = menuAlign === 'bottom' 
        ? triggerRect.bottom + gap 
        : triggerRect.top - menuHeight - gap;

      if (top < padding) top = triggerRect.bottom + gap;
      if (top + menuHeight > window.innerHeight - padding) top = triggerRect.top - menuHeight - gap;

      // 2. الاتجاه الأفقي الأساسي
      let left;
      if (menuPosition === 'right') {
        left = isRTL ? triggerRect.left - menuWidth : triggerRect.right;
      } else if (menuPosition === 'left') {
        left = isRTL ? triggerRect.right : triggerRect.left - menuWidth;
      } else {
        left = triggerRect.left + (triggerRect.width / 2) - (menuWidth / 2);
      }

      // 3. منع الخروج من الشاشة + قلب ذكي عند الاقتراب من الحافة
      const maxLeft = window.innerWidth - menuWidth - padding;
      
      if (left < padding) {
        // محاولة القلب للجانب الآخر إذا التصق باليسار
        const flipLeft = isRTL ? triggerRect.right : triggerRect.left - menuWidth;
        left = (flipLeft >= padding && flipLeft <= maxLeft) ? flipLeft : padding;
      } 
      else if (left > maxLeft) {
        // محاولة القلب للجانب الآخر إذا التصق باليمين
        const flipLeft = isRTL ? triggerRect.left - menuWidth : triggerRect.right;
        left = (flipLeft >= padding && flipLeft <= maxLeft) ? flipLeft : maxLeft;
      }

      setCoords({ top, left });
    };

    calculatePosition();
    
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen, menuPosition, menuAlign, isRTL]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      onOpen?.();
    }
  }, [disabled, onOpen]);

  const handleActionClick = useCallback((action, e) => {
    e.stopPropagation();
    if (action.disabled) return;
    action.onClick?.(e);
    if (action.closeOnClick !== false) handleClose();
  }, [handleClose]);

  const visibleActions = actions.filter(a => a.visible !== false);
  if (visibleActions.length === 0 && !isOpen) return null;

  // === محتوى القائمة ===
  const menuContent = (
    <div
      ref={menuRef}
      className={`
        fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
        border border-gray-200 dark:border-gray-700 py-2 
        min-w-[160px] max-w-[280px] animate-fadeIn
        ${menuClassName}
      `}
      style={{ 
        top: coords.top, 
        left: coords.left, 
        zIndex: zIndex,
        maxWidth: 'calc(100vw - 32px)',
      }}
      role="menu"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {visibleActions.length > 0 ? (
        visibleActions.map((action, idx) => {
          if (action.divider) {
            return <div key={`d-${idx}`} className="h-px bg-gray-100 dark:bg-gray-700 my-1.5 mx-2" role="separator" />;
          }
          return (
            <button
              key={idx}
              onClick={(e) => handleActionClick(action, e)}
              disabled={action.disabled}
              type="button"
              role="menuitem"
              className={`
                w-full px-4 py-2.5 text-sm font-semibold flex items-center gap-3 
                transition-colors ${isRTL ? 'text-right' : 'text-left'}
                ${action.danger 
                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                  : action.disabled 
                    ? 'text-gray-300 cursor-not-allowed dark:text-gray-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
                ${action.className || ''}
              `}
            >
              {action.icon && (
                <span style={{ color: action.danger ? '#DC2626' : '#6B7280', display: 'flex', alignItems: 'center' }}>
                  {typeof action.icon === 'function' ? <action.icon size={16} /> : action.icon}
                </span>
              )}
              <span className="flex-1">{action.label}</span>
              {action.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${action.badgeClassName || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {action.badge}
                </span>
              )}
            </button>
          );
        })
      ) : (
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">لا توجد خيارات</div>
      )}
    </div>
  );

  return (
    <div className="relative inline-block">
      {/* زر التشغيل */}
      <button
        ref={triggerRef}
        onClick={isOpen ? handleClose : handleOpen}
        disabled={disabled}
        title={tooltip}
        type="button"
        aria-expanded={isOpen}
        className={`
          w-10 h-10 flex items-center justify-center rounded-xl border-none bg-transparent 
          transition-all duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
          ${isOpen ? 'bg-gray-200 dark:bg-gray-600' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${triggerClassName}
        `}
        style={{ color: isOpen ? '#1F2937' : '#6B7280' }}
      >
 {/*        {typeof triggerIcon === 'function' ? <triggerIcon size={20} /> : triggerIcon} */}
        {typeof triggerIcon === 'function' ? (
  <triggerIcon size={20} />  // ✅ PascalCase - مكون
) : React.isValidElement(triggerIcon) ? (
  triggerIcon  // ✅ عنصر React جاهز
) : (
  <FaEllipsisH size={20} />  // ✅ fallback
)}
      </button>


      {/* Overlay + القائمة عبر Portal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            style={{ zIndex: zIndex - 1 }} 
            onClick={handleClose} 
          />
          {typeof document !== 'undefined' && createPortal(menuContent, document.body)}
        </>
      )}
    </div>
  );
};

export default ActionMenu;