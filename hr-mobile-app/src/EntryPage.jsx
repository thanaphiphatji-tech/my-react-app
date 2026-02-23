export default function EntryPage({ onEnterApp }) {

  const goDashboard = () => {
    window.location.href =
      "https://script.google.com/macros/s/AKfycbyEX2_dopaayoa10XBwG1zqxI0_GOsWeLTNIML8O5TqlLPNHmBfuKC0GfSHEOzPylQ82g/exec";
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center font-['Noto_Sans_Thai']">
      
          <div className="w-full max-w-md h-full bg-[#111827] flex flex-col justify-center items-center px-8 shadow-2xl">

              <h1 className="text-2xl font-bold text-white mb-2">
                  HR Management System
              </h1>

              <p className="text-gray-400 text-sm mb-10">
                  เลือกระบบที่ต้องการเข้าใช้งาน
              </p>

              <button
                  onClick={goDashboard}
                  className="w-full mb-4 py-3 rounded-xl bg-[#46bdc6] text-[#111827] font-semibold"
              >
                  เข้า Dashboard (Admin)
              </button>

              <button
                  onClick={() => {
                      console.log("CLICKED APP BUTTON");
                      onEnterApp();
                  }}
                  className="w-full py-3 rounded-xl border border-[#46bdc6] text-[#46bdc6] font-semibold hover:bg-[#46bdc6] hover:text-[#111827] transition"
              >
                  เข้า App (Mobile)
              </button>

          </div>
    </div>
  );
}