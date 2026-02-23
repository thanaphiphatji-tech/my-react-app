import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { submitLeaveRequest, fetchLeaveQuota, fetchLeaveRequests } from '../../api/attendance.api'
import { updateLeaveStatus } from '../../api/attendance.api'
import { fetchEmployeeById } from '../../api/attendance.api'

const TABS = ['PENDING', 'APPROVE', 'ALL']

const RequestTab = ({ employeeData, onRefresh }) => {

    const [activeTab, setActiveTab] = useState('PENDING')
    const [showModal, setShowModal] = useState(false)
    const [leaveQuota, setLeaveQuota] = useState([])
    const [leaveRequests, setLeaveRequests] = useState([])
    const LEAVE_COLOR = { Vacation: '#1E88E5', Sick: '#E53935', Personal: '#FB8C00' }
    const LEAVE_LABEL = { Vacation: 'ลาพักร้อน', Sick: 'ลาป่วย', Personal: 'ลากิจ' }
    const STATUS_COLOR = { APPROVED: '#22c55e', PENDING: '#facc15', REJECTED: '#ef4444' }
    const [refreshing, setRefreshing] = useState(false)
    const [actionLoading, setActionLoading] = useState({ id: null, type: null })
    const [employeeMap, setEmployeeMap] = useState({})


    useEffect(() => {
    if (!employeeData?.employeeId) return
    loadRequests()
    loadQuota()
    }, [employeeData?.employeeId])

    useEffect(() => {
    if (!leaveRequests.length) return
    loadEmployeeNames()
    }, [leaveRequests])

    if (!employeeData) return null

    async function loadQuota() {
        try {
            console.log('calling quota API...')

            const data = await fetchLeaveQuota({
                employeeId: employeeData.employeeId
            })

            setLeaveQuota(data || [])

        } catch (err) {
            console.error('loadQuota error:', err)
            setLeaveQuota([])
        }
    }

    async function loadRequests() {
        console.log("EMPLOYEE:", employeeData.employeeId)
        console.log("MANAGER:", employeeData.managerId)
        try {

            const data = await fetchLeaveRequests({
            employeeId: employeeData.employeeId,
            managerId: employeeData.employeeId
            })

            console.log('leaveRequests response:', data)

            // 🔥 บังคับให้เป็น array เสมอ
            if (Array.isArray(data)) {
                setLeaveRequests(data)
            } else {
                setLeaveRequests([])
            }

        } catch (err) {
            console.error('loadRequests error:', err)
            setLeaveRequests([])
        }
    }
async function loadEmployeeNames() {
  try {

    const uniqueIds = [
      ...new Set(leaveRequests.map(r => r.employeeId))
    ]

    const newMap = { ...employeeMap }

    for (const id of uniqueIds) {

      // ✅ ถ้ามีแล้ว ไม่ต้องยิง API ซ้ำ
      if (newMap[id]) continue

      const emp = await fetchEmployeeById(id)
      if (emp) {
        newMap[id] = emp.fullName
      }
    }

    setEmployeeMap(newMap)

  } catch (err) {
    console.error('loadEmployeeNames error:', err)
  }
}



    /* =========================
       HANDLER
    ========================= */

    async function handleApprove(id) {
        try {
            setActionLoading({ id, type: 'approve' })

            await updateLeaveStatus({
                id,
                status: 'APPROVED',
                approvedBy: employeeData.employeeId
            })

            await loadRequests()
            await loadQuota()

        } catch (err) {
            console.error(err)
            alert('เกิดข้อผิดพลาด')
        } finally {
            setActionLoading({ id: null, type: null })
        }
    }


    async function handleReject(id) {
        try {
            setActionLoading({ id, type: 'reject' })

            await updateLeaveStatus({
                id,
                status: 'REJECTED',
                approvedBy: employeeData.employeeId
            })

            await loadRequests()
            await loadQuota()

        } catch (err) {
            console.error(err)
            alert('เกิดข้อผิดพลาด')
        } finally {
            setActionLoading({ id: null, type: null })
        }
    }



    /* =========================
       FILTER LIST
    ========================= */

    function getCurrentList() {

        if (!Array.isArray(leaveRequests)) return []

        if (activeTab === 'PENDING') {
            return leaveRequests.filter(
                r =>
                    r.employeeId === employeeData.employeeId &&
                    r.status === 'PENDING'
            )
        }

        if (activeTab === 'APPROVE') {
            return leaveRequests.filter(
                r =>
                    r.managerId === employeeData.employeeId &&
                    r.status === 'PENDING'
            )
        }

        if (activeTab === 'ALL') {
            return leaveRequests.filter(
            r => r.employeeId === employeeData.employeeId ||
            r.managerId === employeeData.employeeId
            )
        }
    }

    /* =========================
       REFRESH FUNCTION  👈 ใส่ตรงนี้
    ========================= */

    async function handleRefresh() {
        try {
            setRefreshing(true)
            await Promise.all([
                loadRequests(),
                loadQuota()
            ])
        } finally {
            setRefreshing(false)
        }
    }

    /* =========================
       UI
    ========================= */

    return (
        <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">

            {/* ================= QUOTA PANEL ================= */}
            <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 space-y-4 shrink-0">

                <h3 className="font-black text-[10px] uppercase tracking-widest text-[#46bdc6]">
                    สิทธิคงเหลือ
                </h3>

                {leaveQuota.length === 0 && (
                    <div className="text-xs text-gray-500 italic">
                        ไม่มีข้อมูลสิทธิ์วันลา
                    </div>
                )}

                {leaveQuota.map((leave, i) => {

                    const color = LEAVE_COLOR[leave.leaveType] || '#888'

                    // 🎯 ให้ bar แสดงจาก remaining (เต็มก่อน)
                    const percent =
                        leave.totalDays > 0
                            ? (leave.remainingDays / leave.totalDays) * 100
                            : 0

                    return (
                        <div key={`quota-${i}`} className="space-y-1">

                            <div className="flex justify-between text-[10px] font-bold">
                                <span style={{ color }}>
                                    {LEAVE_LABEL[leave.leaveType] || leave.leaveType}
                                </span>
                                <span>
                                    ใช้ไป {leave.usedDays} / เหลือ {leave.remainingDays}
                                </span>
                            </div>

                            <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${percent}%`,
                                        backgroundColor: color
                                    }}
                                />
                            </div>

                        </div>
                    )
                })}



            </div>

            {/* ================= ADD BUTTON ================= */}
            <button
                onClick={() => setShowModal(true)}
                className="shrink-0 w-full bg-[#46bdc6] py-3 rounded-xl text-[#111827] font-black text-sm flex items-center justify-center gap-2"
            >
                <Plus size={18} strokeWidth={3} />
                เพิ่มคำขอ
            </button>

            {/* ================= TAB SELECTOR ================= */}
            <div className="grid grid-cols-3 bg-gray-800/40 rounded-xl border border-gray-700 overflow-hidden shrink-0 text-[11px] font-bold">

                <TabButton
                    active={activeTab === 'PENDING'}
                    onClick={() => setActiveTab('PENDING')}
                >
                    รออนุมัติ
                </TabButton>

                <TabButton
                    active={activeTab === 'APPROVE'}
                    onClick={() => setActiveTab('APPROVE')}
                >
                    ต้องอนุมัติ
                </TabButton>

                <TabButton
                    active={activeTab === 'ALL'}
                    onClick={() => setActiveTab('ALL')}
                >
                    ทั้งหมด
                </TabButton>

            </div>

            {/* ================= LIST PANEL ================= */}
            <div className="flex-1 overflow-y-auto space-y-2">

                {getCurrentList().length === 0 && (
                    <div className="text-xs text-gray-500 italic">
                        ไม่มีรายการ
                    </div>
                )}

                <button
                    onClick={handleRefresh}
                    className="text-xs text-[#46bdc6] text-center py-2"
                >
                    {refreshing ? 'กำลังรีเฟรช...' : 'ดึงลงเพื่อรีเฟรช'}
                </button>

                {getCurrentList().map(req => {

                    const isApproveTab =
                        activeTab === 'APPROVE' &&
                        req.managerId === employeeData.employeeId &&
                        req.status === 'PENDING'

                    const leaveColor = LEAVE_COLOR[req.leaveType] || '#888'
                    const statusColor = STATUS_COLOR[req.status] || '#999'

                    const requesterName =
                        employeeMap[req.employeeId] || req.employeeId

                    return (
                        <div
                            key={req.id}
                            className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 flex justify-between items-center"
                            style={{ borderLeft: `3px solid ${leaveColor}` }}
                        >

                            {/* LEFT */}
                            <div className="space-y-1">

                                {/* 👤 คนที่ขอ (แสดงทุก tab) */}
                                <p className="text-xs font-bold text-[#46bdc6]">
                                    {requesterName}
                                </p>

                                {/* 📌 ประเภทการลา */}
                                <p
                                    className="text-xs font-bold"
                                    style={{ color: leaveColor }}
                                >
                                    {LEAVE_LABEL[req.leaveType] || req.leaveType}
                                </p>

                                {/* 📅 วันที่ */}
                                <p className="text-[10px] text-gray-400">
                                    {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                    ({req.totalDays} วัน)
                                </p>

                            </div>

                            {/* RIGHT */}
                            {isApproveTab ? (
                                <div className="flex flex-col gap-1 text-[9px] font-bold">

                                    <button
                                        onClick={() => handleApprove(req.id)}
                                        className="px-2 py-1 rounded-md"
                                        style={{
                                            backgroundColor: '#22c55e20',
                                            color: '#22c55e',
                                            border: '1px solid #22c55e40'
                                        }}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="px-2 py-1 rounded-md"
                                        style={{
                                            backgroundColor: '#ef444420',
                                            color: '#ef4444',
                                            border: '1px solid #ef444440'
                                        }}
                                    >
                                        Reject
                                    </button>

                                </div>
                            ) : (
                                <span
                                    className="text-[9px] px-2 py-0.5 rounded-full font-black"
                                    style={{
                                        backgroundColor: statusColor + '20',
                                        color: statusColor,
                                        border: `1px solid ${statusColor}40`
                                    }}
                                >
                                    {req.status}
                                </span>
                            )}

                        </div>
                    )
                })}


            </div>
            {showModal && (
                <LeaveModal
                    onClose={() => setShowModal(false)}
                    employeeData={employeeData}
                    onSuccess={handleRefresh}
                />
            )}
        </div>
    )
}

export default RequestTab

/* ========================= COMPONENTS ========================= */
function formatDate(dateStr) {
    if (!dateStr) return '-'

    const d = new Date(dateStr)

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}
function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`py-2 transition ${active
                ? 'bg-[#46bdc6] text-[#111827]'
                : 'text-gray-400'
                }`}
        >
            {children}
        </button>
    )
}

function RequestCard({ req }) {

    function getStatusColor(status) {
        if (status === 'APPROVED')
            return 'bg-green-500/10 text-green-500 border-green-500/20'
        if (status === 'REJECTED')
            return 'bg-red-500/10 text-red-500 border-red-500/20'
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }

    function getStatusText(status) {
        if (status === 'APPROVED') return 'อนุมัติแล้ว'
        if (status === 'REJECTED') return 'ปฏิเสธ'
        return 'รออนุมัติ'
    }

    return (
        <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
            <div>
                <p className="text-xs font-bold">{req.type}</p>
                <p className="text-[9px] text-gray-500">
                    {req.date} ({req.days} วัน)
                </p>
            </div>

            {req.status && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black ${getStatusColor(req.status)}`}>
                    {getStatusText(req.status)}
                </span>
            )}
        </div>
    )
}



function LeaveModal({ onClose, employeeData, onSuccess }) {
    const [leaveType, setLeaveType] = useState('Vacation')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)

    /* =====================
       CALCULATE DAYS
    ===================== */

    const totalDays = useMemo(() => {

        if (!startDate || !endDate) return 0

        const start = new Date(startDate)
        const end = new Date(endDate)

        const diff =
            (end - start) / (1000 * 60 * 60 * 24)

        return diff >= 0 ? diff + 1 : 0

    }, [startDate, endDate])

    async function handleSubmit() {

        if (!employeeData?.employeeId) {
            alert('ไม่พบข้อมูลพนักงาน')
            return
        }

        if (!startDate || !endDate) {
            alert('กรุณาเลือกวันที่')
            return
        }

        if (totalDays <= 0) {
            alert('จำนวนวันลาไม่ถูกต้อง')
            return
        }

        try {

            setLoading(true)

            await submitLeaveRequest({
                employeeId: employeeData.employeeId,
                managerId: employeeData.managerId,
                leaveType,
                startDate,
                endDate,
                totalDays,
                reason
            })

            if (onSuccess) {
                await onSuccess()
            }

            setTimeout(() => {
                setLoading(false)
                onClose()
            }, 500)

        } catch (err) {
            console.error(err)
            alert('เกิดข้อผิดพลาด')
            setLoading(false)
        }

    }




    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50">

            <div className="w-full max-w-md bg-[#111827] rounded-t-3xl p-5 space-y-4 animate-slide-up">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black">
                        เพิ่มคำขอวันลา
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 text-sm"
                    >
                        ปิด
                    </button>
                </div>

                {/* TYPE */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">
                        ประเภทการลา
                    </label>
                    <select
                        value={leaveType}
                        onChange={e => setLeaveType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm"
                    >
                        <option value="Vacation">ลาพักร้อน</option>
                        <option value="Sick">ลาป่วย</option>
                        <option value="Personal">ลากิจ</option>
                    </select>
                </div>

                {/* DATE RANGE */}
                <div className="grid grid-cols-2 gap-3">

                    <div className="space-y-1">
                        <label className="text-xs text-gray-400">
                            วันที่เริ่ม
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-gray-400">
                            วันที่สิ้นสุด
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm"
                        />
                    </div>

                </div>

                {/* TOTAL DAYS */}
                <div className="text-xs text-[#46bdc6] font-bold">
                    จำนวนวันลา: {totalDays} วัน
                </div>

                {/* REASON */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">
                        หมายเหตุ
                    </label>
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm resize-none"
                    />
                </div>

                {/* BUTTONS */}
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
                        className={`flex-1 py-3 rounded-xl text-sm font-black transition ${loading
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-[#46bdc6] text-[#111827]'
                            }`}
                    >
                        {loading ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
                    </button>


                </div>

            </div>
        </div>
    )
}


