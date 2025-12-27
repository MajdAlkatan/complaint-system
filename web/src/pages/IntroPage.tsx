import { Users } from "lucide-react";
import { RiShieldUserLine } from "react-icons/ri";
import LogoCircle from "/assets/logosyr3@3x 1.svg";
import Footer from "../components/Footer";

export default function IntroPage() {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center bg-green-50 " dir="rtl">
        <div className="w-full max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <img src={LogoCircle} className="w-30 h-30" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 tracking-wider">
              منصة إدارة الشكاوى الحكومية
            </h1>
            <p className="text-gray-600 text-base md:text-lg tracking-widest">
              نظام احترافي لإدارة ومتابعة حل شكاوى المواطنين بشفافية كاملة
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto mt-10">
            <div className="bg-white rounded-xl shadow-md border  border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-8 max-md:mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-7 h-7 text-green-500/50" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
                بوابة الموظف
              </h2>
              <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
                الوصول إلى الشكاوى المخصصة وتحديث الحالات والتعاون بكفاءة لحل
                مشكلات المواطنين
              </p>
              <a href="/employee-login">
                <button className="w-full bg-[#82b440] hover:bg-[#72a030] text-white font-medium py-2.5 px-5 rounded-md transition-colors text-sm">
                  تسجيل الدخول
                </button>
              </a>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-8 max-md:mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <RiShieldUserLine className="w-7 h-7 text-green-500/50" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
                بوابة المدير
              </h2>
              <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
                التحكم الكامل في النظام مع التحليلات وإدارة المستخدمين وإمكانيات
                الإشراف
              </p>
              <a href="/admin-login">
                {" "}
                <button className="w-full bg-[#82b440] hover:bg-[#72a030] text-white font-medium py-2.5 px-5 rounded-md transition-colors text-sm">
                  تسجيل الدخول
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
