import { useMemo, useState } from 'react'
import { Camera, Lock, ChevronRight, LogOut } from 'lucide-react'
import { changePassword } from '../../api/attendance.api'

const ProfileTab = ({ employeeData, loading, onLogout }) => {

    /* ==============================
       CALCULATE TENURE
    ============================== */
    const [showChangePassword, setShowChangePassword] = useState(false)
    const tenureText = useMemo(() => {
        if (!employeeData?.startDate) return '-'

        const start = new Date(employeeData.startDate)
        const now = new Date()

        let years = now.getFullYear() - start.getFullYear()
        let months = now.getMonth() - start.getMonth()

        if (months < 0) {
            years--
            months += 12
        }

        return `${years} ปี ${months} เดือน`
    }, [employeeData])

    if (loading || !employeeData) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                กำลังโหลดข้อมูล...
            </div>
        )
    }

    return (

        <div className="flex flex-col h-full gap-4 p-4 animate-fade-in overflow-hidden">

            {/* PROFILE HEADER */}
            <div className="flex flex-col items-center py-2 shrink-0">

                <div className="w-20 h-20 rounded-full border-2 border-[#46bdc6] p-1 bg-gray-900 shadow-xl relative">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeData.fullName}`}
                        alt="Profile"
                        className="w-full h-full rounded-full"
                    />
                </div>

                <h2 className="mt-2 text-lg font-black">
                    {employeeData.fullName}
                </h2>

                <p className="text-[#46bdc6] font-bold text-[10px] uppercase tracking-widest">
                    {employeeData.employeeId}
                </p>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">

                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 grid grid-cols-2 gap-4">

                    {/* 2 Columns */}
                    <Info label="ตำแหน่ง" value={employeeData.position} />
                    <Info label="แผนก" value={employeeData.department} />
                    <Info label="สถานะ" value={employeeData.status} />
                    <Info label="อายุงาน" value={tenureText} />

                    {/* Email - Full Width */}
                    <div className="col-span-2 pt-1">
                        <Info label="Email" value={employeeData.email} />
                    </div>

                    {/* Divider */}
                    <div className="col-span-2 h-px bg-white/10 my-1" />

                    {/* Manager - Full Width */}
                    <div className="col-span-2">
                        <Info label="ผู้จัดการ" value={employeeData.managerName} />
                    </div>

                </div>


                <button onClick={() => {
                        console.log("clicked")
                        setShowChangePassword(true)
                        }}
                    
                    className="w-full bg-gray-800/40 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Lock size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold">เปลี่ยนรหัสผ่าน</span>
                    </div>
                    <ChevronRight size={14} />
                </button>

                <button
                    onClick={onLogout}
                    className="w-full bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex justify-center items-center gap-2 text-red-500 font-black text-xs"
                >
                    ออกจากระบบ
                </button>

            </div>

            {showChangePassword && (
                <ChangePasswordModal
                    employeeId={employeeData.employeeId}
                    onClose={() => setShowChangePassword(false)}
                />
            )}
            
        </div>
    )
}

export default ProfileTab

function Info({ label, value }) {
    return (
        <div>
            <span className="text-[8px] text-gray-500 font-black uppercase block leading-none mb-1">
                {label}
            </span>
            <span className="text-xs font-bold block leading-none break-words">
                {value || '-'}
            </span>
        </div>
    )
}

function ChangePasswordModal({ employeeId, onClose }) {

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit() {

    if (!newPassword || !confirmPassword) {
      alert('กรุณากรอกรหัสผ่าน')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน')
      return
    }

    if (newPassword.length < 4) {
      alert('รหัสผ่านต้องมากกว่า 4 ตัวอักษร')
      return
    }

    try {
      setLoading(true)

      await changePassword({
        employeeId,
        newPassword
      })

      alert('เปลี่ยนรหัสผ่านสำเร็จ')
      onClose()

    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="w-full max-w-md bg-[#111827] rounded-2xl p-5 space-y-4">

        <h3 className="text-sm font-black">
          เปลี่ยนรหัสผ่าน
        </h3>

        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm"
        />

        <input
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm"
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 py-3 rounded-xl text-sm font-bold"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#46bdc6] py-3 rounded-xl text-[#111827] text-sm font-black"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>

      </div>
    </div>
  )
}