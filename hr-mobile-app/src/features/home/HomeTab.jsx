import { useMemo } from 'react'
import { Clock } from 'lucide-react'

export default function HomeTab({
    attendanceByDate,
    checkInOut,
    loading
}) {

    const todayKey = new Date().toLocaleDateString('sv-SE')
    const todayData = attendanceByDate[todayKey]

    const isCheckedIn = todayData?.checkIn && !todayData?.checkOut
    const isCheckedOut = todayData?.checkIn && todayData?.checkOut

    /* ==============================
       WORK DURATION CALCULATION
    ============================== */
    const workDuration = useMemo(() => {

        if (!todayData?.checkIn) return '00:00'

        const now = new Date()

        const [h, m] = todayData.checkIn.split(':')
        const start = new Date()
        start.setHours(h, m, 0)

        const end = isCheckedOut
            ? (() => {
                const [eh, em] = todayData.checkOut.split(':')
                const d = new Date()
                d.setHours(eh, em, 0)
                return d
            })()
            : now

        const diff = (end - start) / 1000 / 60
        const hours = Math.floor(diff / 60)
        const minutes = Math.floor(diff % 60)

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    }, [todayData, isCheckedOut])


    /* ==============================
       HANDLE CLICK
    ============================== */
    const handleClick = async () => {
        if (loading) return
        await checkInOut()
    }


    /* ==============================
       RENDER
    ============================== */

    const now = new Date()

    const dateLabel = now.toLocaleDateString('th-TH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })

    const timeLabel = now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    return (
        <div className="flex flex-col gap-6 p-4 animate-fade-in">

            {/* CLOCK CARD */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-3xl border border-gray-700 shadow-xl text-center">

                <div className="text-sm text-gray-400 mb-1">
                    {dateLabel}
                </div>

                <div className="text-4xl font-bold text-white mb-6">
                    {timeLabel}
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className={`relative w-40 h-40 mx-auto rounded-full 
    flex flex-col items-center justify-center gap-3
    transition-all duration-300 shadow-2xl
    ${isCheckedIn
                            ? 'bg-red-500/10 border-4 border-red-500 shadow-red-500/30'
                            : 'bg-cyan-400/10 border-4 border-cyan-400 shadow-cyan-400/30'}
  `}
                >

                    <Clock
                        size={36}
                        className={
                            isCheckedIn
                                ? 'text-red-500'
                                : 'text-cyan-400'
                        }
                    />

                    <span
                        className={`font-bold text-lg tracking-widest
      ${isCheckedIn ? 'text-red-500' : 'text-cyan-400'}
    `}
                    >
                        {loading
                            ? 'LOADING...'
                            : isCheckedIn
                                ? 'CHECK OUT'
                                : 'CHECK IN'}
                    </span>

                </button>

                {/* CHECK IN TIME */}
                {todayData?.checkIn && (
                    <div className="mt-6 bg-gray-700/30 border border-gray-600 rounded-xl py-2 text-sm text-gray-300">
                        เข้างานเมื่อ: {todayData.checkIn} น.
                    </div>
                )}

            </div>

            {/* WORK INFO */}
            {todayData?.checkIn && (
                <div className="grid grid-cols-2 gap-4">

                    {/* DURATION */}
                    <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1">
                            WORK DURATION
                        </div>
                        <div className="text-xl font-bold text-white">
                            {workDuration} ชม.
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1">
                            STATUS
                        </div>
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            ปกติ
                        </div>
                    </div>

                </div>
            )}

            {/* TODAY HISTORY */}
            {todayData?.checkIn && (
                <div>
                    <div className="text-white font-semibold mb-3">
                        ประวัติวันนี้
                    </div>

                    <div className="flex flex-col gap-3">

                        {/* CHECK OUT (ถ้ามี) */}
                        {todayData?.checkOut && (
                            <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4 flex justify-between items-center">

                                <div className="flex items-center gap-3">

                                    <div className="bg-red-500/20 p-2 rounded-xl">
                                        <span className="text-red-500 text-lg">←</span>
                                    </div>

                                    <div>
                                        <div className="text-white font-medium">
                                            Check Out
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date().toLocaleDateString('th-TH', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-white font-semibold">
                                    {todayData.checkOut}
                                </div>
                            </div>
                        )}

                        {/* CHECK IN */}
                        <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4 flex justify-between items-center">

                            <div className="flex items-center gap-3">

                                <div className="bg-green-500/20 p-2 rounded-xl">
                                    <span className="text-green-400 text-lg">→</span>
                                </div>

                                <div>
                                    <div className="text-white font-medium">
                                        Check In
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date().toLocaleDateString('th-TH', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="text-white font-semibold">
                                {todayData.checkIn}
                            </div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    )
}
