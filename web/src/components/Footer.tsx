import LogoCircle from "/assets/logosyr3@3x 1.svg";

function Footer() {
  return (
    <div className="text-center  border-t bg-white border-gray-300 mb-8 max-md:px-2">
      <div className="flex justify-center ">
        <img src={LogoCircle} className="w-22 h-22 max-md:w-16 max-md:h-16" />
      </div>
      <p className="text-gray-700 font-semibold text-[13px] mb-1">
        نظام إدارة الشكاوى الحكومية - الجمهورية العربية السورية
      </p>
      <p className="text-gray-600 text-[12px]">
        Government Complaints Management System - Syrian Arab Republic
      </p>
    </div>
  );
}

export default Footer;
