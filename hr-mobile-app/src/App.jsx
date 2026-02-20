import { useState } from 'react'

// Components
import Header from './components/Header'
import BottomNav from './components/BottomNav'

// Features
import HomeTab from './features/home/HomeTab'
import SummaryTab from './features/summary/SummaryTab'
import RequestTab from './features/leave/RequestTab'
import PayrollTab from './features/payroll/PayrollTab'
import ProfileTab from './features/profile/ProfileTab'

// Hooks
import { useAttendance } from './hooks/useAttendance'

const App = ({ employeeData, onLogout }) => {

  if (!employeeData) return null

  const [activeTab, setActiveTab] = useState('home')

  const employeeId = employeeData.employeeId

  /* =========================
     ATTENDANCE
  ========================= */
  const today = new Date()

  const {
    attendanceByDate,
    loading,
    error,
    checkInOut,
    refresh
  } = useAttendance({
    employeeId,
    year: today.getFullYear(),
    month: today.getMonth() + 1
  })

  const headerTitle = (() => {
    switch (activeTab) {
      case 'home': return 'Home'
      case 'summary': return 'Attendance'
      case 'requests': return 'Leaves'
      case 'payroll': return 'Payroll'
      case 'profile': return 'Profile'
      default: return ''
    }
  })()

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex justify-center items-center text-white font-['Noto_Sans_Thai']">

      <div className="w-full max-w-md h-full relative bg-[#111827] flex flex-col shadow-2xl">

        {/* HEADER */}
        <Header
          title={headerTitle}
          profileImg={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeData.fullName}`}
          employeeName={employeeData.fullName}
        />

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden relative">

          {/* HOME */}
          <div className={activeTab === 'home' ? 'h-full block' : 'h-full hidden'}>
            <HomeTab
              employeeId={employeeId}
              checkInOut={checkInOut}
              attendanceByDate={attendanceByDate}
              loading={loading}
              error={error}
            />
          </div>

          {/* SUMMARY */}
          <div className={activeTab === 'summary' ? 'h-full block' : 'h-full hidden'}>
            <SummaryTab employeeId={employeeId} />
          </div>

          {/* REQUEST */}
          <div className={activeTab === 'requests' ? 'h-full block' : 'h-full hidden'}>
            <RequestTab
              employeeData={employeeData}
              onRefresh={refresh}
            />
          </div>

          {/* PAYROLL */}
          <div className={activeTab === 'payroll' ? 'h-full block' : 'h-full hidden'}>
            <PayrollTab />
          </div>

          {/* PROFILE */}
          <div className={activeTab === 'profile' ? 'h-full block' : 'h-full hidden'}>
            <ProfileTab
              employeeData={employeeData}
              onLogout={onLogout}
            />
          </div>

        </div>

        {/* BOTTOM NAV */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

      </div>
    </div>
  )
}

export default App
