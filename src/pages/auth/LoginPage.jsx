import React from 'react';
import { useDispatch } from 'react-redux'; // استيراد الـ Dispatch
import { setUser } from '../../redux/slices/userSlice'; // تأكدي من المسار الصحيح للـ slice
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // دالة وهمية لتسجيل الدخول كأدمن فوراً (للتطوير)
    const handleMockAdminLogin = (e) => {
        e.preventDefault(); // منع تحديث الصفحة
        
        const mockAdminData = {
            user: { 
                id: 1, 
                name: "صالحة (Admin)", 
                role: "ADMIN" 
            },
            token: "mock-token-12345"
        };

        // إرسال البيانات للـ Store
        dispatch(setUser(mockAdminData));
        
        // تخزين التوكن يدوياً كما في الـ userSlice
        localStorage.setItem('token', mockAdminData.token);

        // الانتقال لصفحة "حول" لرؤية التعديلات
        navigate('/about');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg" dir="rtl">
            <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
            
            <form className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium" htmlFor="email">البريد الإلكتروني:</label>
                    <input className="w-full border p-2 rounded-lg" type="email" id="email" name="email" required />
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="password">كلمة المرور:</label>
                    <input className="w-full border p-2 rounded-lg" type="password" id="password" name="password" required />
                </div>
                <button 
                    className="w-full bg-brand-secondary text-white py-2 rounded-lg hover:bg-brand-secondaryHover transition"
                    type="submit"
                >
                    دخول (قريباً)
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-dashed">
                <p className="text-xs text-slate-400 mb-2 text-center">أدوات المطورين (Mock Login)</p>
                <button 
                    onClick={handleMockAdminLogin}
                    className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg border border-slate-200 hover:bg-slate-200 transition text-sm font-semibold"
                >
                    تسجيل دخول سريع كـ ADMIN 🛠️
                </button>
            </div>
        </div>
    );
};

export default LoginPage;