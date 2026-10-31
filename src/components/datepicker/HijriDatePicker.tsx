import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  gregorianToHijri,
  formatDateISO,
  parseDateISO,
  getDualCalendarDays,
  GREGORIAN_MONTHS_AR,
  DAYS_AR,
} from '../../utils/hijri';

interface HijriDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateISO: string, hijriFormatted: string) => void;
  label?: string;
  required?: boolean;
}

export const HijriDatePicker: React.FC<HijriDatePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? parseDateISO(value) : new Date();
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const hijriCurrent = gregorianToHijri(selectedDate);
  const { days, hijriMonthHeader } = getDualCalendarDays(viewYear, viewMonth, selectedDate);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (cellDate: Date) => {
    const iso = formatDateISO(cellDate);
    const hijri = gregorianToHijri(cellDate);
    onChange(iso, hijri.formattedAr);
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    const iso = formatDateISO(today);
    const hijri = gregorianToHijri(today);
    onChange(iso, hijri.formattedAr);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-slate-700 block mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input row with Hijri Badge (Directly matching Screenshot 07) */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-slate-400 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-medium text-slate-800">
              {value || formatDateISO(new Date())}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans">
            {GREGORIAN_MONTHS_AR[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
        </div>

        {/* Hijri Date Badge beside input */}
        <div
          className="shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'var(--accent-metallic-light, #fef3c7)',
            borderColor: 'var(--accent-metallic, #d4af37)',
            color: '#78350f',
          }}
          title="التاريخ الهجري المقابل"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>{hijriCurrent.formattedAr}</span>
        </div>
      </div>

      {/* Custom Dropdown Calendar (Directly matching Screenshot 08) */}
      {isOpen && (
        <div className="absolute top-full mt-1.5 right-0 z-40 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 w-76 animate-in fade-in zoom-in-95 duration-100">
          {/* Calendar Header with Dual Month Representation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={handleNextMonth} // In RTL, next month is on the right arrow
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-xs font-black text-slate-800 block">
                {GREGORIAN_MONTHS_AR[viewMonth]} {viewYear}
              </span>
              <span
                className="text-[11px] font-bold block"
                style={{ color: 'var(--primary-color)' }}
              >
                {hijriMonthHeader}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Day Names (Starting with Sunday = أحد) */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 border-b border-slate-100">
            {DAYS_AR.map((day) => (
              <span key={day} className="text-[11px] font-bold text-slate-500">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid: Gregorian big, Hijri small below */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {days.map((cell, idx) => {
              const isSelected = cell.isSelected;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(cell.date)}
                  className={`h-11 rounded-lg flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? 'text-white font-bold shadow-xs'
                      : cell.isCurrentMonth
                      ? 'text-slate-800 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-50'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: 'var(--primary-color)',
                        }
                      : {}
                  }
                >
                  {/* Gregorian Day (Big) */}
                  <span className="text-xs font-black leading-none font-mono">
                    {cell.gregorianDay}
                  </span>
                  {/* Hijri Day (Small below) */}
                  <span
                    className={`text-[9px] font-medium leading-none mt-1 ${
                      isSelected ? 'text-amber-200' : 'text-slate-400'
                    }`}
                  >
                    {cell.hijriDay}
                  </span>

                  {cell.isToday && !isSelected && (
                    <div
                      className="absolute bottom-1 w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-metallic)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={handleSetToday}
              className="font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              اليوم (Today)
            </button>
            <span className="text-[10px] text-slate-400">تقويم هجري/ميلادي مزدوج</span>
          </div>
        </div>
      )}
    </div>
  );
};
