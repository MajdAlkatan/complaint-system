import { AlertCircle, Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#82b440] rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          عذراً، الصفحة غير موجودة
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو ربما لم تكن موجودة من
          الأساس
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="/">
            <button className="flex items-center gap-2 bg-[#82b440] hover:bg-[#72a030] text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg">
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </button>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            رمز الخطأ: 404 | الصفحة غير موجودة
          </p>
        </div>
      </div>
    </div>
  );
}
