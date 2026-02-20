import { memo } from 'react';

const Header = memo(({ title, profileImg, isCheckedIn, employeeName }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#111827] border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={profileImg}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-[#46bdc6]"
          />
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#111827]
              ${isCheckedIn ? 'bg-green-500' : 'bg-gray-500'}
            `}
          />
        </div>

        <div>
          <p className="text-[10px] text-gray-400 leading-tight italic">
            สวัสดี,
          </p>
          <p className="text-xs font-bold leading-tight">
            {employeeName}
          </p>
        </div>
      </div>

      <h1 className="text-sm font-bold uppercase tracking-widest text-[#46bdc6]">
        {title}
      </h1>
    </div>
  );
});

export default Header;
