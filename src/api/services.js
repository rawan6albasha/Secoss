// src/api/services.js

// Auth Service
export const authService = {
    login: async (credentials) => { /* ... */ },
    register: async (userData) => { /* ... */ },
    // الحصول على بيانات البروفايل لأي مستخدم (عضو، محاضر، أدمن)
    getProfile: async (userId) => {
        // الاستعلام عن بيانات المستخدم + منشوراته (المقبولة فقط للعامة)
    }
};

// Content Service (Lectures & Articles)
// ملاحظة: استخدمنا FormData لدعم رفع ملفات الـ PDF والصور
export const contentService = {
    // 1. للمستخدم (العضو): إرسال منشور جديد للمراجعة
    submitForReview: async (formData) => {
        // formData سيحتوي على: title, summary, file(PDF/Image), type(lecture/article)
        // الحالة الافتراضية في السيرفر ستكون 'pending'
    },

    // 2. للمستخدم: جلب منشوراته الخاصة (لمتابعة حالة القبول/الرفض)
    getMySubmissions: async (userId) => {
        // جلب المنشورات بجميع حالاتها (pending, approved, rejected)
    },

    // 3. للأدمن: جلب طلبات المراجعة المعلقة فقط
    getPendingItems: async () => {
        // Fetch items where status === 'pending'
    },

    // 4. للأدمن: اتخاذ قرار (قبول أو رفض)
    reviewSubmission: async (id, decision) => {
        // decision: { status: 'approved' } 
        // OR { status: 'rejected', reason: 'المحتوى غير كافي' }
    }
};

// Lectures Service (العرض العام)
export const lecturesService = {
    getAllApproved: async () => {
        // جلب المحاضرات التي تم قبولها فقط للعرض في الصفحة العامة
    },
    getLectureById: async (id) => { /* ... */ },
};

// Notification Service (للأدمن والأعضاء)
export const notificationService = {
    getNotifications: async (userId) => {
        // للأدمن: "هناك منشور جديد ينتظر المراجعة"
        // للعضو: "تم رفض/قبول منشورك لسبب كذا..."
    },
    markAsRead: async (notificationId) => { /* ... */ }
};