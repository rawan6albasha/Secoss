// src/components/PendingCard/PendingCard.jsx
import { FaEdit, FaRedo, FaCheck, FaTimes, FaFilePdf, FaImage } from 'react-icons/fa';
import Tag from '../ui/Tag';

const PendingCard = ({ 
  post, 
  isOwner = false, 
  isAdminView = false,
  onEdit, 
  onResubmit,
  onApprove,
  onReject 
}) => {
  return (
    <div className={`p-4 rounded-2xl border ${
      post.status === 'REJECTED' 
        ? 'bg-red-50/40 border-red-200' 
        : 'bg-amber-50/40 border-amber-200'
    }`} dir="rtl">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-black text-slate-800">{post.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{post.category} • {new Date(post.createdAt).toLocaleDateString('ar-EG')}</p>
        </div>
        <Tag variant={post.status === 'REJECTED' ? 'info' : 'muted'} className="text-[10px]">
          {post.status === 'REJECTED' ? '❌ مرفوض' : '🕐 قيد المراجعة'}
        </Tag>
      </div>

      {/* Preview */}
      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{post.summary || 'بدون وصف'}</p>
      
      {post.attachmentType === 'image' && post.attachmentUrl && (
        <img src={post.attachmentUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
      )}
      {post.attachmentType === 'pdf' && (
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg mb-3">
          <FaFilePdf className="text-red-500"/>
          <span className="text-xs text-slate-600">{post.attachmentName || 'ملف PDF'}</span>
        </div>
      )}

      {/* سبب الرفض */}
      {post.status === 'REJECTED' && post.rejectedReason && (
        <div className="p-2 bg-red-100 rounded-lg mb-3">
          <p className="text-xs font-bold text-red-700">⚠️ {post.rejectedReason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
        <div className="flex gap-2">
          {isOwner && ['PENDING', 'REJECTED'].includes(post.status) && (
            <>
              <button 
                onClick={onEdit}
                className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition"
              >
                <FaEdit size={12}/> تعديل
              </button>
              {post.status === 'REJECTED' && (
                <button 
                  onClick={onResubmit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-amber-600 hover:bg-amber-50 transition"
                >
                  <FaRedo size={12}/> إعادة إرسال
                </button>
              )}
            </>
          )}
        </div>
        
        {isAdminView && post.status === 'PENDING' && (
          <div className="flex gap-2">
            <button 
              onClick={onApprove}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 rounded-lg text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              <FaCheck size={12}/> قبول
            </button>
            <button 
              onClick={onReject}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              <FaTimes size={12}/> رفض
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCard;