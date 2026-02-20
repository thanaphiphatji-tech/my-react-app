import React from "react";

const PayrollTab = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          ระบบ Payroll
        </h1>

        {/* Status */}
        <p className="mt-3 text-lg text-yellow-600 font-medium">
          🚧 อยู่ระหว่างพัฒนา
        </p>

        {/* Description */}
        <p className="mt-4 text-gray-500 text-sm leading-relaxed">
          ฟีเจอร์คำนวณเงินเดือน, OT, โบนัส และรายงานสรุป
          กำลังอยู่ในขั้นตอนพัฒนา
          โปรดติดตามเวอร์ชันถัดไป
        </p>

        {/* Version Badge */}
        <div className="mt-6">
          <span className="bg-gray-100 text-gray-600 text-xs px-4 py-1 rounded-full">
            Version 2.0 (Coming Soon)
          </span>
        </div>

        {/* Button */}
        <div className="mt-8">
          <button
            onClick={() => alert("🚧 ระบบ Payroll กำลังพัฒนา")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-medium transition"
          >
            แจ้งเตือนเมื่อพร้อมใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollTab;
