"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import type { Tables } from "@/lib/types";
import { Weight, TrendingUp, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressChartsProps {
  data: Tables<"progress_logs">[];
}

const chartLineStrokeWidth = 2;
const chartDotRadius = 4;
const chartActiveDotRadius = 6;

const commonTooltipContent = (props: any) => (
  <ChartTooltipContent
    {...props}
    indicator="dot"
    labelFormatter={(label, payload) => {
      const dateValue = payload?.[0]?.payload?.date; // 'date' is the key for our Date object
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      // Fallback for safety, though label should be the date object from dataKey
      if (label instanceof Date) {
        return label.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return String(label);
    }}
  />
);

const commonXAxisProps = {
  dataKey: "date", // This will point to the Date object in our mapped data
  tickFormatter: (value: Date) =>
    value.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  minTickGap: 20,
  axisLine: false,
  tickLine: false,
};

const commonYAxisProps = (dataMinOffset = 2, dataMaxOffset = 2) => ({
  domain: [`dataMin - ${dataMinOffset}`, `dataMax + ${dataMaxOffset}`],
  allowDecimals: true,
  axisLine: false,
  tickLine: false,
});

const weightChartConfig = {
  weight: { label: "Weight (kg)", color: "hsl(var(--chart-1))", icon: Weight },
} satisfies ChartConfig;

const armChartConfig = {
  arm: { label: "Arm (cm)", color: "hsl(var(--chart-2))", icon: TrendingUp },
} satisfies ChartConfig;

const chestChartConfig = {
  chest: {
    label: "Chest (cm)",
    color: "hsl(var(--chart-3))",
    icon: TrendingUp,
  },
} satisfies ChartConfig;

const waistChartConfig = {
  waist: {
    label: "Waist (cm)",
    color: "hsl(var(--chart-4))",
    icon: TrendingUp,
  },
} satisfies ChartConfig;

export function ProgressCharts({ data }: ProgressChartsProps) {
  const mappedChartData = useMemo(() => {
    return data.map((log) => ({
      // Ensure date is parsed as local midnight to avoid timezone issues
      date: new Date(log.date + "T00:00:00"),
      weight: log.weight ?? null,
      arm: log.arm_circumference ?? null,
      chest: log.chest_circumference ?? null,
      waist: log.waist_circumference ?? null,
    }));
  }, [data]);

  const lineChartDataKeys = [
    {
      key: "weight",
      config: weightChartConfig,
      title: "Weight Progress",
      unit: "kg",
    },
    {
      key: "arm",
      config: armChartConfig,
      title: "Arm Circumference",
      unit: "cm",
    },
    {
      key: "chest",
      config: chestChartConfig,
      title: "Chest Circumference",
      unit: "cm",
    },
    {
      key: "waist",
      config: waistChartConfig,
      title: "Waist Circumference",
      unit: "cm",
    },
  ];

  const completedWorkoutDays = useMemo(() => {
    return (
      data
        .filter((log) => log.workout_completed === true)
        // Ensure date string is interpreted as local date
        .map((log) => new Date(log.date + "T00:00:00"))
    );
  }, [data]);

  const modifiers = { completed: completedWorkoutDays };
  const modifiersStyles = {
    completed: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "50%",
      fontWeight: "bold",
    } as React.CSSProperties,
  };

  const latestLogDate = useMemo(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.date + "T00:00:00").getTime() -
          new Date(a.date + "T00:00:00").getTime()
      );
      return new Date(sortedData[0].date + "T00:00:00");
    }
    return new Date();
  }, [data]);

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {lineChartDataKeys.map((chart) => {
        // Filter mappedChartData which contains Date objects and correct keys
        const filteredData = mappedChartData.filter(
          (d) =>
            d[chart.key as keyof typeof d] !== null &&
            (d[chart.key as keyof typeof d] as number) > 0
        );

        return (
          <Card key={chart.key} className={cn()}>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                {chart.config[chart.key as keyof typeof chart.config].icon &&
                  React.createElement(
                    chart.config[chart.key as keyof typeof chart.config].icon!,
                    { className: "mr-2 h-5 w-5 text-primary" }
                  )}
                {chart.title}
              </CardTitle>
              <CardDescription>
                Your {chart.key} trend over time ({chart.unit}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <ChartContainer
                  config={chart.config}
                  className="h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredData}
                      margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis {...commonXAxisProps} />
                      <YAxis {...commonYAxisProps()} unit={chart.unit} />
                      <Tooltip content={commonTooltipContent} />
                      <Line
                        type="monotone"
                        dataKey={chart.key}
                        stroke={`var(--color-${chart.key})`}
                        strokeWidth={chartLineStrokeWidth}
                        dot={{ r: chartDotRadius }}
                        activeDot={{ r: chartActiveDotRadius }}
                        name={
                          chart.config[chart.key as keyof typeof chart.config]
                            .label
                        }
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No {chart.key} data logged yet.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CalendarCheck className="mr-2 h-5 w-5 text-primary" />
            Workout Calendar
          </CardTitle>
          <CardDescription>
            Review your workout consistency. Completed days are highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-2 sm:p-4">
          <Calendar
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            defaultMonth={latestLogDate}
            className="rounded-md border"
            numberOfMonths={1}
            ISOWeek={false} // Depending on preference, true might suit some regions more
            showOutsideDays
          />
        </CardContent>
        {completedWorkoutDays.length === 0 && (
          <CardContent>
            <p className="text-muted-foreground text-center pb-4">
              No workouts marked as completed yet.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
