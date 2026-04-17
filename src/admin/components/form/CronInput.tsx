import { useState, useEffect, useMemo, useCallback } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Message } from 'primereact/message';
import {AllowedScheduleIntervals, Days, MonthWeeks} from '../../enums';

interface CronInputProps {
  value?: string;
  onChange: (cron: string) => void;
  allowedInterval: AllowedScheduleIntervals;
}

type CronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly';

export default function CronInput({ value, onChange, allowedInterval }: CronInputProps) {
  // --- 1. Internal Form State ---
  const [activeTab, setActiveTab] = useState(2);
  const [state, setState] = useState({
    cronType: 'daily' as CronType,
    minutes: 0,
    minutesPer: 30,
    hours: new Date().getHours(),
    hoursPer: 1,
    days: 1,
    daysPer: 1,
    monthsInc: 1,
    day: 'MON',
    monthsWeek: '#1',
    weekdaysOnly: false,
    specificWeekDay: false,
    selectedWeekDay: 'MON',
  });

  // --- 2. Select Options ---
  const options = useMemo(() => {
    const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => i + s);
    return {
      minutes: range(0, 59).map(x => ({ label: String(x).padStart(2, '0'), value: x })),
      hours: range(0, 23).map(x => ({ label: String(x).padStart(2, '0'), value: x })),
      monthDays: range(1, 31).map(x => ({ label: String(x), value: x })),
      months: range(1, 12).map(x => ({ label: String(x), value: x })),
      days: Object.entries(Days).map(([k, v]) => ({ label: v, value: k })),
      weeks: Object.entries(MonthWeeks).map(([k, v]) => ({ label: v, value: k })),
    };
  }, []);

  // --- 3. Cron Generation Logic ---
  const computeCron = useCallback(() => {
    const { minutes, minutesPer, hours, hoursPer, daysPer, weekdaysOnly, selectedWeekDay, specificWeekDay, monthsInc, day, monthsWeek, days } = state;

    switch (state.cronType) {
      case 'minutely': return `*/${minutesPer} * * * *`;
      case 'hourly':   return `${minutes} */${hoursPer} * * *`;
      case 'daily':    return weekdaysOnly ? `${minutes} ${hours} * * MON-FRI` : `${minutes} ${hours} 1/${daysPer} * *`;
      case 'weekly':   return `${minutes} ${hours} * * ${selectedWeekDay}`;
      case 'monthly':  return specificWeekDay
        ? `${minutes} ${hours} * 1/${monthsInc} ${day}${monthsWeek}`
        : `${minutes} ${hours} ${days} 1/${monthsInc} *`;
      default: return '0 0 * * *';
    }
  }, [state]);

  // Sync internal state to parent
  useEffect(() => {
    const cron = computeCron();
    if (cron !== value) onChange(cron);
  }, [computeCron, onChange, value]);

  // --- 4. Tab Mapping ---
  const tabToType: Record<number, CronType> = { 0: 'minutely', 1: 'hourly', 2: 'daily', 3: 'weekly', 4: 'monthly' };

  const enabledTabs = useMemo(() => {
    const all = ['minutely', 'hourly', 'daily', 'weekly', 'monthly'];
    switch (allowedInterval) {
      case AllowedScheduleIntervals.DailyAndHigher:
        return all.slice(2); // ['daily', 'weekly', 'monthly']
      case AllowedScheduleIntervals.WeeklyAndHigher:
        return all.slice(3); // ['weekly', 'monthly']
      case AllowedScheduleIntervals.MonthlyAndHigher:
        return all.slice(4); // ['monthly']
      case AllowedScheduleIntervals.None:
        return [];
      default:
        return all;
    }
  }, [allowedInterval]);

  if (allowedInterval === AllowedScheduleIntervals.None) {
    return <Message severity="warn" text="Scheduling is disabled for this organization." />;
  }

  return (
    <TabView activeIndex={activeTab} onTabChange={(e) => {
      setActiveTab(e.index);
      setState(prev => ({ ...prev, cronType: tabToType[e.index] }));
    }}>
      {enabledTabs.includes('minutely') && (
        <TabPanel header="Minutely">
          <div className="flex gap-2 items-center text-xs">
            <span>Every</span>
            <Dropdown className="w-20" value={state.minutesPer} options={options.minutes} onChange={(e) => setState(p => ({ ...p, minutesPer: e.value }))} />
            <span>Minute(s)</span>
          </div>
        </TabPanel>
      )}

      {enabledTabs.includes('hourly') && (
        <TabPanel header="Hourly">
          <div className="flex gap-2 items-center text-xs">
            <span>Every</span>
            <Dropdown className="w-20" value={state.hoursPer} options={rangeToOptions(1, 23)} onChange={(e) => setState(p => ({ ...p, hoursPer: e.value }))} />
            <span>Hour(s) at minute</span>
            <Dropdown className="w-20" value={state.minutes} options={options.minutes} onChange={(e) => setState(p => ({ ...p, minutes: e.value }))} />
          </div>
        </TabPanel>
      )}

      {enabledTabs.includes('daily') && (
        <TabPanel header="Daily">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center text-xs">
              <RadioButton inputId="everyDay" value={false} onChange={() => setState(p => ({ ...p, weekdaysOnly: false }))} checked={!state.weekdaysOnly} />
              <label htmlFor="everyDay">Every</label>
              <Dropdown className="w-20" value={state.daysPer} options={options.monthDays} onChange={(e) => setState(p => ({ ...p, daysPer: e.value }))} />
              <span>Day(s) at</span>
              <Dropdown className="w-20" value={state.hours} options={options.hours} onChange={(e) => setState(p => ({ ...p, hours: e.value }))} />
              <span>:</span>
              <Dropdown className="w-20" value={state.minutes} options={options.minutes} onChange={(e) => setState(p => ({ ...p, minutes: e.value }))} />
            </div>
            <div className="flex gap-2 items-center text-xs">
              <RadioButton inputId="weekdays" value={true} onChange={() => setState(p => ({ ...p, weekdaysOnly: true }))} checked={state.weekdaysOnly} />
              <label htmlFor="weekdays">Every working day at</label>
              <Dropdown className="w-20" value={state.hours} options={options.hours} onChange={(e) => setState(p => ({ ...p, hours: e.value }))} />
              <span>:</span>
              <Dropdown className="w-20" value={state.minutes} options={options.minutes} onChange={(e) => setState(p => ({ ...p, minutes: e.value }))} />
            </div>
          </div>
        </TabPanel>
      )}

      {enabledTabs.includes('weekly') && (
        <TabPanel header="Weekly">
          <div className="flex gap-2 items-center text-xs">
            <Dropdown className="w-32" value={state.selectedWeekDay} options={options.days} onChange={(e) => setState(p => ({ ...p, selectedWeekDay: e.value }))} />
            <span>at</span>
            <Dropdown className="w-20" value={state.hours} options={options.hours} onChange={(e) => setState(p => ({ ...p, hours: e.value }))} />
            <span>:</span>
            <Dropdown className="w-20" value={state.minutes} options={options.minutes} onChange={(e) => setState(p => ({ ...p, minutes: e.value }))} />
          </div>
        </TabPanel>
      )}

      {enabledTabs.includes('monthly') && (
        <TabPanel header="Monthly">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <RadioButton checked={!state.specificWeekDay} onChange={() => setState(p => ({ ...p, specificWeekDay: false }))} />
              <span>On day</span>
              <Dropdown className="w-20" value={state.days} options={options.monthDays} onChange={(e) => setState(p => ({ ...p, days: e.value }))} />
              <span>of every</span>
              <Dropdown className="w-20" value={state.monthsInc} options={options.months} onChange={(e) => setState(p => ({ ...p, monthsInc: e.value }))} />
              <span>month(s)</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <RadioButton checked={state.specificWeekDay} onChange={() => setState(p => ({ ...p, specificWeekDay: true }))} />
              <span>On the</span>
              <Dropdown className="w-32" value={state.monthsWeek} options={options.weeks} onChange={(e) => setState(p => ({ ...p, monthsWeek: e.value }))} />
              <Dropdown className="w-32" value={state.day} options={options.days} onChange={(e) => setState(p => ({ ...p, day: e.value }))} />
              <span>of every</span>
              <Dropdown className="w-20" value={state.monthsInc} options={options.months} onChange={(e) => setState(p => ({ ...p, monthsInc: e.value }))} />
              <span>month(s)</span>
            </div>
          </div>
        </TabPanel>
      )}
    </TabView>
  );
}

function rangeToOptions(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => ({ label: String(i + start), value: i + start }));
}
