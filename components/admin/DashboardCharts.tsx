'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export function RevenueTrendChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5D8D4" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#3A332F" />
        <YAxis tick={{ fontSize: 11 }} stroke="#3A332F" />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #F5D8D4', fontSize: 12 }}
          formatter={(value: number) => [`${value} DH`, 'CA']}
        />
        <Line type="monotone" dataKey="revenue" stroke="#C98374" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: { name: string; sales: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5D8D4" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#3A332F" />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} stroke="#3A332F" />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #F5D8D4', fontSize: 12 }} />
        <Bar dataKey="sales" fill="#D4A574" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
