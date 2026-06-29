import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(i);
  return cells;
}

export default function BookingModal({ doctor, onClose, userId }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setDate] = useState(null);
  const [selectedTime, setTime] = useState(null);
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = generateCalendar(viewYear, viewMonth);

  const formatDate = (day) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const isDisabled = (day) => {
    if (!day) return true;
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const handleDateSelect = async (day) => {
    if (isDisabled(day)) return;
    const dateStr = formatDate(day);
    setDate(dateStr);
    setTime(null);
    setLoading(true);
    try {
      const res = await api.get(
        `/appointments/slots?doctorId=${doctor._id}&date=${dateStr}`,
      );
      setSlots(res.data.slots);
    } catch {
      toast.error("Could not load available slots");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    setBooking(true);
    try {
      await api.post("/appointments", {
        doctorId: doctor._id,
        date: selectedDate,
        time: selectedTime,
        reason,
      });
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
    setDate(null);
    setTime(null);
    setSlots([]);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
    setDate(null);
    setTime(null);
    setSlots([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-light flex-shrink-0">
          <h2 className="text-base font-bold text-midnight">
            Book appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cloud transition-colors"
          >
            <X size={18} className="text-slate" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {success ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "#E1F5EE" }}
              >
                <CheckCircle size={40} style={{ color: "#1D9E75" }} />
              </motion.div>
              <h3 className="text-xl font-bold text-midnight mb-2">
                Appointment booked
              </h3>
              <p className="text-sm text-slate mb-1">
                Your appointment with <strong>{doctor.user?.name}</strong> is
                confirmed.
              </p>
              <p className="text-sm text-slate mb-6">
                {new Date(selectedDate).toLocaleDateString("en-PK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                at {selectedTime}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#0C447C" }}
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Doctor info */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "#F8FAFC" }}
              >
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "#E6F1FB" }}
                >
                  {doctor.profilePicture ? (
                    <img
                      src={doctor.profilePicture}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-bold text-lg"
                      style={{ color: "#0C447C" }}
                    >
                      {doctor.user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-midnight text-sm">
                    {doctor.user?.name}
                  </p>
                  <p className="text-xs text-slate">{doctor.specialization}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate">
                      <MapPin size={11} /> {doctor.user?.city}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate">
                      <DollarSign size={11} /> Rs. {doctor.fee}
                    </span>
                  </div>
                </div>
                <span className="badge-teal flex-shrink-0">Verified</span>
              </div>

              {/* Calendar */}
              <div>
                <p className="text-sm font-semibold text-midnight mb-3">
                  Select a date
                </p>
                <div className="border border-sky-light rounded-xl overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b border-sky-light"
                    style={{ background: "#F8FAFC" }}
                  >
                    <button
                      onClick={prevMonth}
                      className="p-1.5 rounded-lg hover:bg-sky-light transition-colors text-slate"
                    >
                      ‹
                    </button>
                    <p className="text-sm font-semibold text-midnight">
                      {MONTHS[viewMonth]} {viewYear}
                    </p>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 rounded-lg hover:bg-sky-light transition-colors text-slate"
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-7 border-b border-sky-light">
                    {DAYS.map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-medium text-slate py-2"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 p-2 gap-1">
                    {cells.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={isDisabled(day)}
                        className="aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center"
                        style={{
                          background:
                            selectedDate === formatDate(day) && day
                              ? "#0C447C"
                              : "transparent",
                          color: !day
                            ? "transparent"
                            : isDisabled(day)
                              ? "#C4C3BE"
                              : selectedDate === formatDate(day)
                                ? "white"
                                : "#042C53",
                          cursor: isDisabled(day) ? "not-allowed" : "pointer",
                        }}
                      >
                        {day || ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-semibold text-midnight mb-3">
                    Available times for{" "}
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-PK",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      },
                    )}
                  </p>
                  {loading ? (
                    <div className="flex items-center justify-center h-16">
                      <div className="w-5 h-5 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-6 rounded-xl border border-sky-light">
                      <p className="text-sm text-slate">
                        No available slots for this date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className="py-2 rounded-xl text-xs font-medium transition-all"
                          style={{
                            background:
                              selectedTime === slot ? "#0C447C" : "#F8FAFC",
                            color: selectedTime === slot ? "white" : "#042C53",
                            border: `1px solid ${selectedTime === slot ? "#0C447C" : "#E6F1FB"}`,
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reason */}
              {selectedTime && (
                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Reason for visit{" "}
                    <span className="text-slate font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for visit..."
                    rows={3}
                    className="input-field text-sm resize-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-sky-light flex-shrink-0">
            {selectedDate && selectedTime ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate">Selected slot</p>
                  <p className="text-sm font-semibold text-midnight">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-PK",
                      {
                        day: "numeric",
                        month: "short",
                      },
                    )}{" "}
                    · {selectedTime}
                  </p>
                </div>
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                             text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: "#1D9E75" }}
                >
                  {booking ? (
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                  {booking ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate text-center">
                Select a date and time slot to continue
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
