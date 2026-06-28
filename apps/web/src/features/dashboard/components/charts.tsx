'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartProps<T> {
  data: T[];
  title: string;
  height?: number;
}

export function LineChartWidget({ data, title, height = 300 }: ChartProps<any>) {
  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant mb-md">
        {title}
      </h4>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
            <YAxis stroke="#767586" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="value"
              name="Value"
              stroke="#4648d4"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
            {data[0]?.benchmark !== undefined && (
              <Line
                type="monotone"
                dataKey="benchmark"
                name="Benchmark"
                stroke="#6b38d4"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BarChartWidget({ data, title, height = 300 }: ChartProps<any>) {
  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant mb-md">
        {title}
      </h4>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
            <YAxis stroke="#767586" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" name="Attainment %" fill="#4648d4" radius={[4, 4, 0, 0]} />
            {data[0]?.target !== undefined && (
              <Bar dataKey="target" name="Target" fill="#eff4ff" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AreaChartWidget({ data, title, height = 300 }: ChartProps<any>) {
  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant mb-md">
        {title}
      </h4>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4648d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4648d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b38d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6b38d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
            <YAxis stroke="#767586" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#4648d4"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="costs"
              name="Costs"
              stroke="#6b38d4"
              fillOpacity={1}
              fill="url(#colorCosts)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RadialProgressWidget({ data, title, height = 300 }: ChartProps<any>) {
  const score = data[0]?.value || 0;

  return (
    <div className="bento-card bg-surface-container-lowest p-lg overflow-hidden relative">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant mb-xl">
        {title}
      </h4>
      <div className="flex flex-col items-center justify-center" style={{ height: height - 40 }}>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#eff4ff"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={data[0]?.fill || '#4648d4'}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * score) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <p className="font-headline-xl text-[36px] text-primary font-black leading-none">
              {score}%
            </p>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-xs">
              Attainment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
