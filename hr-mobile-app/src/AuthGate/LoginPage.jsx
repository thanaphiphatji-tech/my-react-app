import { useState } from 'react'
import { fetchEmployeeById } from '../api/attendance.api'

const LoginPage = ({ onLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()

    if (!username) {
      setError('กรุณากรอก Username')
      return
    }

    if (password !== '12345') {
      setError('รหัสผ่านไม่ถูกต้อง')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 🔥 ดึงข้อมูลพนักงานจาก Google Sheet
      const emp = await fetchEmployeeById(username)

      if (!emp || emp.error) {
        setError('ไม่พบผู้ใช้งาน')
        setLoading(false)
        return
      }

      // 🔥 ดึงชื่อ manager เพิ่ม
      let managerName = '-'

      if (emp.managerId) {
        try {
          const manager = await fetchEmployeeById(emp.managerId)
          managerName = manager?.fullName || '-'
        } catch (err) {
          console.error('manager fetch error:', err)
        }
      }

      // 🔥 ส่งข้อมูลกลับ AuthGate
      onLogin({
        ...emp,
        managerName
      })

    } catch (err) {
      console.error(err)
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="h-screen w-screen bg-black flex justify-center items-center font-['Noto_Sans_Thai']">

    <div className="w-full max-w-md h-full bg-[#111827] flex flex-col justify-center px-8 shadow-2xl text-white">

      <h1 className="text-2xl font-bold text-[#46bdc6] mb-2 text-center">
        HR Mobile App
      </h1>

      <p className="text-gray-400 text-sm mb-8 text-center">
        กรุณาเข้าสู่ระบบ
      </p>

      <form onSubmit={handleLogin} className="space-y-4">

        {/* USERNAME */}
        <div>
          <label className="text-xs text-gray-400">
            Username (Employee ID)
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm focus:outline-none focus:border-[#46bdc6]"
            placeholder="TESTUSER"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs text-gray-400">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm focus:outline-none focus:border-[#46bdc6]"
            placeholder="12345"
          />
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-[#46bdc6] text-[#111827]'
          }`}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full mt-2 text-xs text-gray-400 hover:text-[#46bdc6] transition"
        >
          ← กลับหน้าเลือกระบบ
        </button>

      </form>

    </div>

  </div>
)
}

export default LoginPage
