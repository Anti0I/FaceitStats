"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { MOCK_ROLE_EFFICIENCY } from "@/lib/mock-data";

export function RoleEfficiency() {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Role Efficiency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ROLE_EFFICIENCY} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="role" 
                type="category" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                width={60}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'var(--muted)/20' }}
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <Bar 
                dataKey="efficiency" 
                fill="var(--primary)" 
                radius={[0, 4, 4, 0]} 
                barSize={32}
                background={{ fill: 'var(--secondary)', radius: [0, 4, 4, 0] }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
