import { useEffect, useMemo, useState } from 'react'
import { fetchAttendanceByMonth } from '../../api/attendance.api'
import { fetchHolidaysByMonth } from '../../api/attendance.api'
import { fetchLeaveByMonth } from '../../api/attendance.api'

const THEME = {
    today: '#46bdc6',
    workDot: '#46bdc6',
    leaveDot: '#FBC02D',
    holidayBg: '#d32f2f80',
    weekendBg: '#1c2f5e'
}

const LEAVE_COLOR = {
    Vacation: '#1E88E5',
    Sick: '#E53935',
    Personal: '#FB8C00'
}

const PENDING_COLOR = '#FBC02D'

export default function SummaryTab({ employeeId }) {

    const today = new Date()
    const [currentDate, setCurrentDate] = useState(today)
    const [attendance, setAttendance] = useState([])
    const [selectedDate, setSelectedDate] = useState(today)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    const [holidays, setHolidays] = useState([])
    const [leaves, setLeaves] = useState([])
    /* ================================
       LOAD MONTH DATA
    ================================= */

    useEffect(() => {
        if (!employeeId) return
        loadMonth()
    }, [year, month, employeeId])

    async function loadMonth() {
        setAttendance([])
        setHolidays([])
        setLeaves([])
        try {
            const [attendanceRes, holidayRes, leaveRes] = await Promise.all([
                fetchAttendanceByMonth({ employeeId, year, month }),
                fetchHolidaysByMonth({ year, month }),
                fetchLeaveByMonth({ employeeId, year, month })
            ])

            // ✅ ไม่ต้อง .data
            setAttendance(attendanceRes || [])
            setHolidays(holidayRes || [])
            setLeaves(leaveRes || [])

        } catch (err) {
            console.error(err)
            setAttendance([])
            setHolidays([])
            setLeaves([])
        }
    }


    /* ================================
       MAP DATA BY DATE
    ================================= */

    const attendanceMap = useMemo(() => {
        const map = {}
        attendance.forEach(d => {
            map[d.date] = d
        })
        return map
    }, [attendance])
    const holidayMap = useMemo(() => {
        const map = {}
        holidays.forEach(h => {
            map[h.date] = h
        })
        return map
    }, [holidays])
    const leaveMap = useMemo(() => {
        const map = {}

        leaves.forEach(l => {

            const start = new Date(l.startDate)
            const end = new Date(l.endDate)

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const key = d.toLocaleDateString('sv-SE')

                map[key] = {
                    type: l.leaveType,
                    status: l.status
                }
            }

        })

        return map
    }, [leaves])
    const selectedKey = selectedDate.toLocaleDateString('sv-SE')
    /* ================================
       STAT CARDS (DEFAULT = 0)
    ================================= */

    const stats = useMemo(() => {

        let work = 0
        let vacation = 0
        let sick = 0
        let personal = 0

        // ✅ 1. นับวันทำงาน (ถูกอยู่แล้ว)
        attendance.forEach(d => {
            if (d.checkIn && d.checkOut) {
                work++
            }
        })

        // ✅ 2. นับวันลาเฉพาะวันในเดือนนี้จริง ๆ
        leaves.forEach(l => {

            const start = new Date(l.startDate)
            const end = new Date(l.endDate)

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

                const dYear = d.getFullYear()
                const dMonth = d.getMonth() + 1

                // 🎯 นับเฉพาะวันในเดือนที่เลือก
                if (dYear === year && dMonth === month) {

                    if (l.leaveType === 'Vacation') vacation++
                    if (l.leaveType === 'Sick') sick++
                    if (l.leaveType === 'Personal') personal++
                }
            }

        })

        return { work, vacation, sick, personal }

    }, [attendance, leaves, year, month])


    /* ================================
       CALENDAR GENERATION
    ================================= */

    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay()

    const calendarDays = []

    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null)
    }

    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push(new Date(year, month - 1, d))
    }

    /* ================================
       UI
    ================================= */

    return (
        <div className="p-4 space-y-6">

            {/* MONTH HEADER */}
            <div className="flex justify-between items-center text-white">
                <button
                    onClick={() =>
                        setCurrentDate(new Date(year, month - 2, 1))
                    }
                >
                    ◀
                </button>

                <h2 className="text-lg font-bold">
                    {currentDate.toLocaleDateString('th-TH', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </h2>

                <button
                    onClick={() =>
                        setCurrentDate(new Date(year, month, 1))
                    }
                >
                    ▶
                </button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-4 gap-3">

                <StatCard label="มาทำงาน" value={stats.work || 0} color="#46bdc6" />
                <StatCard label="ลาพักร้อน" value={stats.vacation || 0} color="#1E88E5" />
                <StatCard label="ลาป่วย" value={stats.sick || 0} color="#E53935" />
                <StatCard label="ลากิจ" value={stats.personal || 0} color="#FB8C00" />

            </div>

            {/* CALENDAR */}
            <div className="grid grid-cols-7 gap-2 text-center text-white">

                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-xs opacity-50">
                        {d}
                    </div>
                ))}

                {calendarDays.map((dateObj, index) => {

                    if (!dateObj)
                        return <div key={index}></div>

                    const dateKey = dateObj.toLocaleDateString('sv-SE')
                    const isToday =
                        dateObj.toDateString() === today.toDateString()

                    const isSelected =
                        dateObj.toDateString() ===
                        selectedDate.toDateString()

                    const isWeekend =
                        dateObj.getDay() === 0 ||
                        dateObj.getDay() === 6

                    const dayData = attendanceMap[dateKey]
                    const holiday = holidayMap[dateKey]
                    const leaveData = leaveMap[dateKey]


                    let bg = '#111827'

                    if (isWeekend) bg = THEME.weekendBg
                    if (holiday) bg = THEME.holidayBg
                    if (isToday) bg = THEME.today
                    if (isSelected) bg = '#ffffff20'

                    return (
                        <div
                            key={index}
                            onClick={() => setSelectedDate(dateObj)}
                            className="h-12 flex flex-col items-center justify-center rounded-xl cursor-pointer transition"
                            style={{ backgroundColor: bg }}
                        >
                            <span className="text-sm">
                                {dateObj.getDate()}
                            </span>

                            {/* WORK DOT */}
                            {dayData?.checkIn && !leaveData && (
                                <div
                                    className="w-1.5 h-1.5 rounded-full mt-1"
                                    style={{ backgroundColor: THEME.workDot }}
                                />
                            )}

                            {/* LEAVE DOT */}
                            {leaveData && (
                                <div
                                    className="w-1.5 h-1.5 rounded-full mt-1"
                                    style={{
                                        backgroundColor:
                                            leaveData.status === 'PENDING'
                                                ? PENDING_COLOR
                                                : LEAVE_COLOR[leaveData.type] || '#999'
                                    }}
                                />
                            )}
                        </div>
                    )
                })}

            </div>

            {/* DATE DETAIL */}
            <div className="relative bg-gray-900/60 rounded-2xl p-4 text-white space-y-3 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">

                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />

                <div className="text-xs tracking-wider opacity-60">
                    DATE DETAIL ·{' '}
                    {selectedDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short'
                    }).toUpperCase()}
                </div>

                {(() => {

                    const selectedKey =
                        selectedDate.toLocaleDateString('sv-SE')

                    const holiday = holidayMap?.[selectedKey]
                    const workData = attendanceMap?.[selectedKey]
                    const leaveData = leaveMap?.[selectedKey]

                    /* ===== HOLIDAY ===== */
                    if (holiday) {
                        return (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">สถานะ</span>
                                    <span className="font-medium text-yellow-400">
                                        วันหยุดบริษัท
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">ชื่อวันหยุด</span>
                                    <span>{holiday.holidayName}</span>
                                </div>
                            </>
                        )
                    }

                    /* ===== LEAVE ===== */
                    if (leaveData) {

                        const leaveLabelMap = {
                            Vacation: 'ลาพักร้อน',
                            Sick: 'ลาป่วย',
                            Personal: 'ลากิจ'
                        }

                        const leaveColorMap = {
                            Vacation: '#1E88E5',
                            Sick: '#E53935',
                            Personal: '#FB8C00'
                        }

                        const label = leaveLabelMap[leaveData.type]
                        const color =
                            leaveData.status === 'PENDING'
                                ? PENDING_COLOR
                                : leaveColorMap[leaveData.type]

                        return (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">สถานะ</span>
                                    <span
                                        className="font-medium"
                                        style={{ color }}
                                    >
                                        {label}
                                        {leaveData.status === 'PENDING' && ' (รออนุมัติ)'}
                                    </span>
                                </div>
                            </>
                        )
                    }


                    /* ===== WORK ===== */
                    if (workData) {
                        return (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">สถานะ</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: THEME.today }}
                                    >
                                        มาทำงานปกติ
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">เวลา</span>
                                    <span>
                                        {workData.checkIn || '-'} - {workData.checkOut || '-'}
                                    </span>
                                </div>
                            </>
                        )
                    }

                    /* ===== NO DATA ===== */
                    return (
                        <div className="opacity-40 text-sm">
                            ไม่มีข้อมูล
                        </div>
                    )

                })()}
            </div>


        </div>
    )
}

/* =====================================
   STAT CARD COMPONENT
===================================== */

function StatCard({ label, value, color }) {
    return (
        <div
            className="rounded-xl p-3 text-white text-center"
            style={{
                borderTop: `3px solid ${color}`,
                backgroundColor: '#485575'
            }}
        >
            <div className="text-lg font-bold">
                {value}
            </div>
            <div className="text-xs opacity-60">
                {label}
            </div>
        </div>
    )
}
