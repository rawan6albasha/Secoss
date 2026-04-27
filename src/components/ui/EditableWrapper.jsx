// src/components/ui/EditableWrapper/EditableWrapper.jsx
import React from 'react';
import { FaEdit } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';

const EditableWrapper = ({ 
  isAdmin, 
  onEdit, 
  children, 
  className = "",
  editButtonPosition = 'top-start',
  editIconSize = 12,
  editButtonLabel = 'تعديل',
  showButton =true,
}) => {
  const { isDark } = useTheme();

  const getPositionClasses = (position) => {
    const positions = {
      'top-start': 'top-[-12px] start-[-12px]',
      'top-end': 'top-[-12px] end-[-12px]',
      'bottom-start': 'bottom-[-12px] start-[-12px]',
      'bottom-end': 'bottom-[-12px] end-[-12px]',
    };
    return positions[position] || positions['top-start'];
  };

  if (!isAdmin) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div className={`group relative ${className}`}>
      {/* زر التعديل === */}
{ showButton &&(     <button
        onClick={onEdit}
        className={`
          absolute z-10 p-2 rounded-full
          flex items-center justify-center
          cursor-pointer border-none
          transition-all duration-150
          opacity-0 group-hover:opacity-100
          hover:scale-110
          ${isDark 
            ? 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-lg shadow-brand-primary/25' 
            : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-brand'
          }
          ${getPositionClasses(editButtonPosition)}
        `}
        aria-label={editButtonLabel}
        type="button"
        title={editButtonLabel}
      >
        <FaEdit size={editIconSize} />
      </button>)}
      
      {children}
    </div>
  );
};

export default EditableWrapper;