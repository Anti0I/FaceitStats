"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MOCK_ELO_HISTORY } from "@/lib/mock-data";

export function EloChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>ELO Progression</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_ELO_HISTORY}>
                <defs>
                <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                </defs>
                <XAxis 
                    dataKey="match" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                />
                <Area
                    type="monotone"
                    dataKey="elo"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorElo)"
                    strokeWidth={2}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
