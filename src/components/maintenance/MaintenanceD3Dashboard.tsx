import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Filter,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { CraneMaintenanceEvent, MechanicTechnicianItem, EgyptCraneFleetItem } from '../../types/erp';

interface MaintenanceD3DashboardProps {
  events: CraneMaintenanceEvent[];
  mechanics: MechanicTechnicianItem[];
  fleet: EgyptCraneFleetItem[];
  onSelectEvent?: (event: CraneMaintenanceEvent) => void;
  onNewEvent?: () => void;
}

export const MaintenanceD3Dashboard: React.FC<MaintenanceD3DashboardProps> = ({
  events,
  mechanics,
  fleet,
  onSelectEvent,
  onNewEvent,
}) => {
  // Chart Metric Mode for Frequency Chart
  const [metricMode, setMetricMode] = useState<'count' | 'downtime' | 'cost'>('count');
  const [selectedCraneFilter, setSelectedCraneFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [timelineRangeMonths, setTimelineRangeMonths] = useState<number>(6); // Next 6 months

  // SVG Refs for D3 Render
  const timelineSvgRef = useRef<SVGSVGElement | null>(null);
  const frequencySvgRef = useRef<SVGSVGElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const frequencyContainerRef = useRef<HTMLDivElement | null>(null);

  // Active Tooltip State for D3 Interactions
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCrane = selectedCraneFilter === 'all' || ev.craneId === selectedCraneFilter;
      const matchPriority = selectedPriorityFilter === 'all' || ev.priority === selectedPriorityFilter;
      return matchCrane && matchPriority;
    });
  }, [events, selectedCraneFilter, selectedPriorityFilter]);

  // Aggregate Metrics for Quick KPI Cards
  const kpiStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let overdueCount = 0;
    let dueSoonCount = 0; // next 14 days
    let inProgressCount = 0;
    let totalDowntimeHours = 0;
    let totalSpend = 0;

    events.forEach((ev) => {
      totalDowntimeHours += ev.downtimeHours || 0;
      totalSpend += ev.actualCost > 0 ? ev.actualCost : ev.estimatedCost || 0;

      if (ev.status === 'قيد التنفيذ بالورشة / الموقع') {
        inProgressCount++;
      } else if (ev.status === 'متأخرة / تنبيه حرج') {
        overdueCount++;
      } else {
        const targetDate = new Date(ev.nextDueDate || ev.scheduledDate);
        const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          overdueCount++;
        } else if (diffDays <= 14) {
          dueSoonCount++;
        }
      }
    });

    return {
      totalEvents: events.length,
      overdueCount,
      dueSoonCount,
      inProgressCount,
      totalDowntimeHours,
      totalSpend,
    };
  }, [events]);

  // =========================================================================
  // D3 CHART 1: UPCOMING SERVICE DEADLINES HORIZON & COUNTDOWN TIMELINE
  // =========================================================================
  useEffect(() => {
    if (!timelineSvgRef.current || !timelineContainerRef.current) return;

    const container = timelineContainerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(340, fleet.length * 48 + 80);
    const margin = { top: 40, right: 180, bottom: 40, left: 50 }; // RTL: crane labels on the right
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(timelineSvgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Gradient & Filter Definitions
    const defs = svg.append('defs');

    // Glow filter for critical / overdue milestones
    const glowFilter = defs.append('filter').attr('id', 'glow-red').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Date domain: from 1 month ago to N months ahead
    const today = new Date('2026-10-28');
    const startDate = d3.timeMonth.offset(today, -1);
    const endDate = d3.timeMonth.offset(today, timelineRangeMonths);

    const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, innerWidth]);

    // Unique cranes from fleet
    const craneList = fleet.map((c) => ({
      id: c.id,
      code: c.code || 'EC-CRANE',
      model: c.model,
      capacityTon: c.capacityTon,
    }));
    const yScale = d3
      .scaleBand()
      .domain(craneList.map((c) => c.id))
      .range([0, innerHeight])
      .padding(0.25);

    // 1. Background Grid Lines for Months
    const monthTicks = xScale.ticks(d3.timeMonth);
    g.selectAll('.grid-line-month')
      .data(monthTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line-month')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-dasharray', '3,3');

    // 2. Horizontal Track for Each Crane
    craneList.forEach((crane) => {
      const y = (yScale(crane.id) || 0) + yScale.bandwidth() / 2;

      // Track line
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', 'rgba(255, 255, 255, 0.12)')
        .attr('stroke-width', 1.5);

      // Crane Label on Right (RTL Oriented)
      const labelGroup = g
        .append('g')
        .attr('transform', `translate(${innerWidth + 12}, ${y})`)
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedCraneFilter((prev) => (prev === crane.id ? 'all' : crane.id));
        });

      // Crane Code Badge
      labelGroup
        .append('rect')
        .attr('x', 0)
        .attr('y', -11)
        .attr('width', 64)
        .attr('height', 22)
        .attr('rx', 5)
        .attr('fill', selectedCraneFilter === crane.id ? '#B91C1C' : '#1E293B')
        .attr('stroke', selectedCraneFilter === crane.id ? '#FDE68A' : 'rgba(255, 255, 255, 0.2)');

      labelGroup
        .append('text')
        .attr('x', 32)
        .attr('y', 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .attr('fill', '#F8FAFC')
        .text(crane.code);

      // Model & Ton text
      labelGroup
        .append('text')
        .attr('x', 72)
        .attr('y', 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#CBD5E1')
        .text(`${crane.model?.split('(')[0] || 'Crane'} (${crane.capacityTon}T)`);
    });

    // 3. Today / Reference Line (Late Oct 2026)
    const todayX = xScale(today);
    if (todayX >= 0 && todayX <= innerWidth) {
      // Glow line
      g.append('line')
        .attr('x1', todayX)
        .attr('x2', todayX)
        .attr('y1', -15)
        .attr('y2', innerHeight + 10)
        .attr('stroke', '#DFB15B')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '5,3');

      // Today Header Tag
      const todayTag = g.append('g').attr('transform', `translate(${todayX}, -18)`);
      todayTag
        .append('rect')
        .attr('x', -35)
        .attr('y', -12)
        .attr('width', 70)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', '#DFB15B')
        .attr('stroke', '#FEF08A');

      todayTag
        .append('text')
        .attr('x', 0)
        .attr('y', 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#0F172A')
        .text('اليوم (الآن)');
    }

    // 4. Milestone Nodes (Upcoming & Overdue Service Events)
    filteredEvents.forEach((ev) => {
      const craneY = yScale(ev.craneId);
      if (craneY === undefined) return;
      const centerY = craneY + yScale.bandwidth() / 2;

      const targetDate = new Date(ev.nextDueDate || ev.scheduledDate);
      const nodeX = xScale(targetDate);
      if (nodeX < 0 || nodeX > innerWidth) return;

      const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isOverdue = diffDays < 0 || ev.status === 'متأخرة / تنبيه حرج';
      const isDueSoon = !isOverdue && diffDays <= 14;
      const isInProgress = ev.status === 'قيد التنفيذ بالورشة / الموقع';

      let nodeColor = '#10B981'; // Green: Normal Scheduled
      let strokeColor = '#6EE7B7';
      let nodeRadius = 8;

      if (isOverdue) {
        nodeColor = '#EF4444'; // Red: Overdue
        strokeColor = '#FCA5A5';
        nodeRadius = 10;
      } else if (isDueSoon) {
        nodeColor = '#F59E0B'; // Amber: Due Soon
        strokeColor = '#FDE68A';
        nodeRadius = 9;
      } else if (isInProgress) {
        nodeColor = '#3B82F6'; // Blue: In Progress
        strokeColor = '#93C5FD';
        nodeRadius = 9;
      }

      const nodeGroup = g
        .append('g')
        .attr('transform', `translate(${nodeX}, ${centerY})`)
        .attr('cursor', 'pointer')
        .attr('class', 'milestone-node')
        .on('mouseenter', (event) => {
          const rect = container.getBoundingClientRect();
          setTooltipData({
            visible: true,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: (
              <div className="p-3 text-right text-xs max-w-xs space-y-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span className="font-mono text-amber-400 font-bold">{ev.eventNo}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOverdue
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isDueSoon
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isOverdue ? `متأخرة بـ ${Math.abs(diffDays)} يوم` : `متبقي ${diffDays} يوم`}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{ev.craneCode} - {ev.craneModel}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">{ev.eventType}</div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                  <div>
                    <span className="text-slate-400 block">تاريخ الاستحقاق:</span>
                    <span className="font-mono font-bold text-slate-200">{ev.nextDueDate || ev.scheduledDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">عداد الساعات:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {ev.currentHourMeter} / {ev.nextDueHourMeter} س
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">المسؤول الفني:</span>
                    <span className="font-semibold text-slate-200">{ev.leadMechanicNameAr || 'لم يحدد'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">الموقع / الورشة:</span>
                    <span className="font-semibold text-slate-200 truncate block">{ev.workshopLocation}</span>
                  </div>
                </div>
                {ev.sparePartsUsed && ev.sparePartsUsed.length > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>قطع الغيار المطلوبة:</span>
                    <span className="font-bold text-emerald-400">{ev.sparePartsUsed.length} أصناف</span>
                  </div>
                )}
                <div className="text-[10px] text-amber-400/90 text-center pt-1 border-t border-slate-800">
                  انقر لعرض تفاصيل الصيانة وتعديل المهمة
                </div>
              </div>
            ),
          });
        })
        .on('mouseleave', () => {
          setTooltipData((prev) => ({ ...prev, visible: false }));
        })
        .on('click', () => {
          if (onSelectEvent) onSelectEvent(ev);
        });

      // Pulse ring for overdue
      if (isOverdue) {
        nodeGroup
          .append('circle')
          .attr('r', nodeRadius + 5)
          .attr('fill', 'none')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.7)
          .attr('class', 'animate-ping')
          .attr('filter', 'url(#glow-red)');
      }

      // Main Milestone Circle
      nodeGroup
        .append('circle')
        .attr('r', nodeRadius)
        .attr('fill', nodeColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 2.5);

      // Icon / Center indicator
      nodeGroup
        .append('circle')
        .attr('r', 3)
        .attr('fill', '#FFFFFF');

      // Countdown Days tag below node
      nodeGroup
        .append('rect')
        .attr('x', -22)
        .attr('y', nodeRadius + 3)
        .attr('width', 44)
        .attr('height', 14)
        .attr('rx', 3)
        .attr('fill', 'rgba(15, 23, 42, 0.85)')
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.8);

      nodeGroup
        .append('text')
        .attr('x', 0)
        .attr('y', nodeRadius + 13)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .attr('fill', isOverdue ? '#FCA5A5' : '#F8FAFC')
        .text(isOverdue ? `-${Math.abs(diffDays)}د` : `+${diffDays}د`);
    });

    // 5. X-Axis for Dates
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat((d) => {
        const date = d as Date;
        return date.toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' });
      });

    const axisG = g
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    axisG.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '10px').attr('font-weight', 'bold');
    axisG.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.2)');
    axisG.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.2)');
  }, [fleet, filteredEvents, timelineRangeMonths, selectedCraneFilter, onSelectEvent]);

  // =========================================================================
  // D3 CHART 2: MAINTENANCE FREQUENCY & SUBSYSTEM BREAKDOWN PER CRANE
  // =========================================================================
  useEffect(() => {
    if (!frequencySvgRef.current || !frequencyContainerRef.current) return;

    const container = frequencyContainerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(320, fleet.length * 44 + 70);
    const margin = { top: 30, right: 180, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(frequencySvgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Group events by crane
    const craneStats = fleet.map((crane) => {
      const craneEvents = events.filter((e) => e.craneId === crane.id);

      // Subsystem categorization
      const subsystems = {
        hydraulic: 0,
        diesel: 0,
        boom: 0,
        electronics: 0,
        loadTest: 0,
        other: 0,
      };

      let totalDowntime = 0;
      let totalCost = 0;

      craneEvents.forEach((ev) => {
        const val = metricMode === 'count' ? 1 : metricMode === 'downtime' ? ev.downtimeHours || 0 : ev.actualCost || ev.estimatedCost || 0;

        if (ev.eventType.includes('هيدروليك')) subsystems.hydraulic += val;
        else if (ev.eventType.includes('محرك') || ev.eventType.includes('ديزل')) subsystems.diesel += val;
        else if (ev.eventType.includes('البوم') || ev.eventType.includes('الوايرات')) subsystems.boom += val;
        else if (ev.eventType.includes('كمبيوتر') || ev.eventType.includes('حساسات')) subsystems.electronics += val;
        else if (ev.eventType.includes('Load Test') || ev.eventType.includes('أمان')) subsystems.loadTest += val;
        else subsystems.other += val;

        totalDowntime += ev.downtimeHours || 0;
        totalCost += ev.actualCost > 0 ? ev.actualCost : ev.estimatedCost || 0;
      });

      const totalValue =
        metricMode === 'count'
          ? craneEvents.length
          : metricMode === 'downtime'
          ? totalDowntime
          : totalCost;

      return {
        id: crane.id,
        code: crane.code || 'EC-CRANE',
        model: crane.model,
        capacityTon: crane.capacityTon,
        totalEvents: craneEvents.length,
        totalDowntime,
        totalCost,
        totalValue,
        subsystems,
      };
    });

    // Sort cranes descending by metric value
    craneStats.sort((a, b) => b.totalValue - a.totalValue);

    const yScale = d3
      .scaleBand()
      .domain(craneStats.map((c) => c.id))
      .range([0, innerHeight])
      .padding(0.28);

    const maxValue = d3.max(craneStats, (d) => d.totalValue) || 10;
    const xScale = d3.scaleLinear().domain([0, maxValue * 1.15]).range([0, innerWidth]);

    // Subsystem Palette
    const subsystemKeys = ['hydraulic', 'diesel', 'boom', 'electronics', 'loadTest', 'other'] as const;
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(subsystemKeys)
      .range(['#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#64748B']);

    const subsystemLabels: Record<string, string> = {
      hydraulic: 'هيدروليك وبساتم',
      diesel: 'محرك وديزل',
      boom: 'بوم شبكي ووايرات',
      electronics: 'كمبيوتر LMI وحساسات',
      loadTest: 'شهادة أمان ومعايرة',
      other: 'شاسيه وصيانة عامة',
    };

    // 1. Grid lines
    const xTicks = xScale.ticks(6);
    g.selectAll('.x-grid')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('class', 'x-grid')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-dasharray', '3,3');

    // 2. Average Benchmark Line
    const avgValue = d3.mean(craneStats, (d) => d.totalValue) || 0;
    if (avgValue > 0) {
      const avgX = xScale(avgValue);
      g.append('line')
        .attr('x1', avgX)
        .attr('x2', avgX)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#DFB15B')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');

      g.append('text')
        .attr('x', avgX)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#DFB15B')
        .text(`متوسط الأسطول: ${metricMode === 'cost' ? avgValue.toLocaleString('ar-EG') + ' ج.م' : avgValue.toFixed(1)}`);
    }

    // 3. Render Stacked Segmented Bars for each crane
    craneStats.forEach((c) => {
      const y = yScale(c.id);
      if (y === undefined) return;
      const barHeight = yScale.bandwidth();

      // Right Crane Label (RTL)
      const labelG = g
        .append('g')
        .attr('transform', `translate(${innerWidth + 12}, ${y + barHeight / 2})`)
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedCraneFilter((prev) => (prev === c.id ? 'all' : c.id));
        });

      labelG
        .append('rect')
        .attr('x', 0)
        .attr('y', -10)
        .attr('width', 60)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', selectedCraneFilter === c.id ? '#B91C1C' : '#1E293B')
        .attr('stroke', selectedCraneFilter === c.id ? '#FDE68A' : 'rgba(255,255,255,0.2)');

      labelG
        .append('text')
        .attr('x', 30)
        .attr('y', 3.5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .attr('fill', '#F8FAFC')
        .text(c.code);

      labelG
        .append('text')
        .attr('x', 68)
        .attr('y', 3.5)
        .attr('text-anchor', 'start')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#E2E8F0')
        .text(`${c.model?.split('(')[0]} (${c.capacityTon}T)`);

      // Cumulative stacking
      let currentX = 0;
      subsystemKeys.forEach((key) => {
        const segVal = c.subsystems[key];
        if (segVal <= 0) return;

        const segWidth = xScale(segVal);

        const bar = g
          .append('rect')
          .attr('x', currentX)
          .attr('y', y)
          .attr('width', 0) // start at 0 for smooth D3 entry animation
          .attr('height', barHeight)
          .attr('fill', colorScale(key))
          .attr('opacity', 0.88)
          .attr('rx', 2)
          .attr('stroke', 'rgba(15, 23, 42, 0.4)')
          .attr('stroke-width', 1)
          .attr('cursor', 'pointer')
          .on('mouseenter', (event) => {
            const rect = container.getBoundingClientRect();
            setTooltipData({
              visible: true,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              content: (
                <div className="p-2.5 text-right text-xs max-w-xs space-y-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="font-bold text-amber-400">{c.code}</span>
                    <span className="font-mono text-[10px] text-slate-400">{c.model}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{subsystemLabels[key]}:</span>
                    <span className="font-mono text-cyan-400">
                      {metricMode === 'cost'
                        ? segVal.toLocaleString('ar-EG') + ' ج.م'
                        : metricMode === 'downtime'
                        ? segVal + ' ساعة توقف'
                        : segVal + ' مرات صيانة'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                    <span>إجمالي الرافعة:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {metricMode === 'cost'
                        ? c.totalValue.toLocaleString('ar-EG') + ' ج.م'
                        : metricMode === 'downtime'
                        ? c.totalValue + ' س'
                        : c.totalValue + ' مهام'}
                    </span>
                  </div>
                </div>
              ),
            });
          })
          .on('mouseleave', () => {
            setTooltipData((prev) => ({ ...prev, visible: false }));
          });

        // D3 Transition Animation
        bar.transition().duration(650).ease(d3.easeCubicOut).attr('width', segWidth);

        currentX += segWidth;
      });

      // Total Value Label at bar end
      if (c.totalValue > 0) {
        g.append('text')
          .attr('x', currentX + 6)
          .attr('y', y + barHeight / 2 + 3.5)
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .attr('fill', '#94A3B8')
          .text(
            metricMode === 'cost'
              ? (c.totalValue / 1000).toFixed(0) + 'k'
              : metricMode === 'downtime'
              ? c.totalValue + 'س'
              : c.totalValue
          );
      }
    });

    // 4. X-Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => {
        const val = d as number;
        if (metricMode === 'cost') return `${(val / 1000).toLocaleString('ar-EG')}k ج.م`;
        if (metricMode === 'downtime') return `${val} س`;
        return `${val}`;
      });

    const axisG = g.append('g').attr('transform', `translate(0, ${innerHeight})`).call(xAxis);

    axisG.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '10px').attr('font-weight', 'bold');
    axisG.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.2)');
    axisG.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.2)');
  }, [fleet, events, metricMode, selectedCraneFilter]);

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">إجمالي مهام الصيانة</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{kpiStats.totalEvents}</div>
          <div className="text-[10px] text-slate-400 mt-1">سجل صيانة معتمد</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-amber-500/10 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-rose-900/50 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-xs font-semibold">متأخرة / تنبيه حرج</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">{kpiStats.overdueCount}</div>
          <div className="text-[10px] text-rose-300/80 mt-1">تحتاج تدخل فوري</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-rose-500/15 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-amber-900/50 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-xs font-semibold">استحقاق خلال 14 يوم</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">{kpiStats.dueSoonCount}</div>
          <div className="text-[10px] text-amber-200/80 mt-1">صيانة دورية قادمة</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-amber-500/15 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-blue-900/50 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-400 mb-1">
            <span className="text-xs font-semibold">قيد التنفيذ بالورش</span>
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-300">{kpiStats.inProgressCount}</div>
          <div className="text-[10px] text-blue-200/80 mt-1">مهمة نشطة حالياً</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-500/15 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">ساعات التوقف (Downtime)</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-300">{kpiStats.totalDowntimeHours} <span className="text-xs font-normal">ساعة</span></div>
          <div className="text-[10px] text-slate-400 mt-1">إجمالي توقف الأسطول</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">تكلفة الصيانة وقطع الغيار</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">
            {(kpiStats.totalSpend / 1000).toFixed(0)}k <span className="text-xs font-normal">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">استثمار جاهزية الأسطول</div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* FILTER & CONTROL TOOLBAR */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>فلترة البيانات:</span>
          </div>

          {/* Crane Filter */}
          <select
            value={selectedCraneFilter}
            onChange={(e) => setSelectedCraneFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="all">كل رافعات الأسطول ({fleet.length} رافعة)</option>
            {fleet.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code || 'EC-CRANE'} - {c.model} ({c.capacityTon}T)
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="all">جميع مستويات الأولوية</option>
            <option value="حرجة / عاجلة">حرجة / عاجلة (Critical)</option>
            <option value="متوسطة">متوسطة (Medium)</option>
            <option value="عادية">عادية (Routine)</option>
          </select>

          {/* Timeline Range selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setTimelineRangeMonths(3)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                timelineRangeMonths === 3 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              3 أشهر
            </button>
            <button
              onClick={() => setTimelineRangeMonths(6)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                timelineRangeMonths === 6 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              6 أشهر
            </button>
            <button
              onClick={() => setTimelineRangeMonths(12)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                timelineRangeMonths === 12 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              سنة كاملة
            </button>
          </div>
        </div>

        {/* Action Button */}
        {onNewEvent && (
          <button
            onClick={onNewEvent}
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <Wrench className="w-4 h-4" />
            <span>تسجيل أمر صيانة جديد</span>
          </button>
        )}
      </div>

      {/* D3 CHART 1: UPCOMING SERVICE DEADLINES TIMELINE */}
      <div
        ref={timelineContainerRef}
        className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>أفق استحقاقات الصيانة الدورية ومواعيد الخدمة القادمة</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  D3.js Interactive Timeline
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تتبع زمني تفاعلي لمواعيد فحص الأمان واختبار الأحمال (Load Test) وتغيير زيوت وفلاتر الأوناش حتى 1200 طن
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-400/40 animate-pulse" />
              <span>متأخرة / تنبيه حرج</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>استحقاق قريب (14 يوم)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>قيد التنفيذ بالورشة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>مجدولة بالموعد</span>
            </div>
          </div>
        </div>

        {/* SVG Container for D3 */}
        <div className="overflow-x-auto relative">
          <svg ref={timelineSvgRef} className="w-full select-none" />
        </div>
      </div>

      {/* D3 CHART 2: MAINTENANCE FREQUENCY & SUBSYSTEM BREAKDOWN */}
      <div
        ref={frequencyContainerRef}
        className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>معدل وتكرار الصيانة وأعطال الأنظمة لكل رافعة</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  D3.js Stacked Frequency
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                توزيع مهام الصيانة وساعات التعطل وتكاليف قطع الغيار موزعة حسب الأنظمة الفرعية (هيدروليك، محركات، بوم، LMI)
              </p>
            </div>
          </div>

          {/* Metric Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setMetricMode('count')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricMode === 'count'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              عدد مرات الصيانة
            </button>
            <button
              onClick={() => setMetricMode('downtime')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricMode === 'downtime'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ساعات التوقف (Downtime)
            </button>
            <button
              onClick={() => setMetricMode('cost')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricMode === 'cost'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              التكلفة الإجمالية (ج.م)
            </button>
          </div>
        </div>

        {/* Subsystem Color Legend */}
        <div className="flex flex-wrap items-center justify-end gap-3 text-[11px] mb-3 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#3B82F6]" />
            <span>هيدروليك وبساتم</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" />
            <span>محرك وديزل</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]" />
            <span>بوم شبكي ووايرات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#8B5CF6]" />
            <span>كمبيوتر LMI وحساسات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
            <span>شهادة أمان Load Test</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#64748B]" />
            <span>شاسيه وفرامل</span>
          </div>
        </div>

        {/* SVG Container for D3 */}
        <div className="overflow-x-auto relative">
          <svg ref={frequencySvgRef} className="w-full select-none" />
        </div>
      </div>

      {/* FLOATING RICH D3 TOOLTIP */}
      {tooltipData.visible && (
        <div
          className="pointer-events-none absolute z-50 transition-all duration-75"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
            transform: 'translate(-50%, -105%)',
          }}
        >
          {tooltipData.content}
        </div>
      )}
    </div>
  );
};
