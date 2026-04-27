// src/components/ui/BackButton/BackButton.jsx
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const BackButton = ({ label, labelKey, className = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ إذا احتجت لترجمة

  return (
    <button
      onClick={() => navigate(-1)}
      className={`
        p-3 rounded-xl text-2xl 
        text-gray-400 hover:text-brand-primary 
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
        ${className}
      `}
      aria-label={labelKey ? t(labelKey) : label || 'الرجوع'}
      title={labelKey ? t(labelKey) : label || 'الرجوع'}
    >
      <FaArrowRight />
    </button>
  );
};

export default BackButton;