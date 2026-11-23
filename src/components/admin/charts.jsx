"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { formatBDT, formatCompact } from "@/lib/utils";
/** Responsive Recharts wrappers shared by the dashboard and reports pages. */
const COLORS = ["#7a1f3d", "#c73d70", "#de6793", "#e6ce7a", "#b6b6c0", "#641931"];
const tooltipStyle = {
    borderRadius: 12,
    border: "1px solid #f5c6d8",
    boxShadow: "0 12px 36px -16px rgb(44 9 23 / 0.22)",
    fontSize: 12,
};
const axisTick = { fill: "#8d8d9b", fontSize: 11 };
export function RevenueAreaChart({ data, height = 280, }) {
    return (<div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="beraRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a1f3d" stopOpacity={0.32}/>
              <stop offset="100%" stopColor="#7a1f3d" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#ededf0" strokeDasharray="4 4"/>
          <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} dy={8}/>
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={52} tickFormatter={(value) => formatCompact(Number(value))}/>
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#ec9cba", strokeDasharray: "4 4" }} formatter={(value) => formatBDT(Number(value))}/>
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7a1f3d" strokeWidth={2.5} fill="url(#beraRevenueFill)" activeDot={{ r: 5, fill: "#7a1f3d", stroke: "#fff", strokeWidth: 2 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>);
}
export function OrdersBarChart({ data, height = 280, }) {
    return (<div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#ededf0" strokeDasharray="4 4"/>
          <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} dy={8}/>
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} allowDecimals={false}/>
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#fdf2f6" }} formatter={(value) => `${Number(value)} orders`}/>
          <Bar dataKey="orders" name="Orders" fill="#c73d70" radius={[6, 6, 0, 0]} maxBarSize={30}/>
        </BarChart>
      </ResponsiveContainer>
    </div>);
}
export function OrderStatusDonut({ data, height = 260, }) {
    const slices = data.filter((slice) => slice.value > 0);
    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    const chartData = slices.length ? slices : [{ name: "No data", value: 1 }];
    return (<div className="relative w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={58} outerRadius={84} paddingAngle={3} stroke="none">
            {chartData.map((slice, index) => (<Cell key={slice.name} fill={slices.length ? COLORS[index % COLORS.length] : "#ededf0"}/>))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value)} orders`}/>
          <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#6d6d7b" }}/>
        </PieChart>
      </ResponsiveContainer>
      {slices.length > 0 && (<div className="pointer-events-none absolute inset-x-0 bottom-8 top-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-ink-900">{total}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Orders</span>
        </div>)}
    </div>);
}
