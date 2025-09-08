'use client'

import type { FC, ComponentProps } from 'react'
import { ResponsiveBar, type BarDatum } from '@nivo/bar'
import { ResponsiveLine, type Serie } from '@nivo/line'
import { ResponsivePie, type PieDatum } from '@nivo/pie'
import { ResponsiveCalendar, type CalendarDatum } from '@nivo/calendar'
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card'
type ChartContainerProps = {
  title?: string
  description?: string
  className?: string
  height?: number
  children: React.ReactNode
}

const ChartContainer: FC<ChartContainerProps> = ({
  title,
  description,
  className,
  height = 400,
  children
}) => (
  <Card className={cn('transition-all duration-200 hover:shadow-lg', className)}>
    {title && (
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
    )}
    <CardContent>
      <div style={{ height: `${height}px` }} className="w-full">
        {children}
      </div>
    </CardContent>
  </Card>
)
type ChartBarProps = {
  data: BarDatum[]
  keys: string[]
  indexBy: string
  colors?: string[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  enableGridX?: boolean
  enableGridY?: boolean
  enableLabel?: boolean
  axisBottom?: {
    tickSize?: number
    tickPadding?: number
    tickRotation?: number
  }
  axisLeft?: {
    tickSize?: number
    tickPadding?: number
    format?: string
  }
}

const ChartBar: FC<ChartBarProps> = ({
  data,
  keys,
  indexBy,
  colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  height = 400,
  margin = { top: 50, right: 110, bottom: 50, left: 60 },
  enableGridX = false,
  enableGridY = true,
  enableLabel = false,
  axisBottom = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
  },
  axisLeft = {
    tickSize: 5,
    tickPadding: 5,
  }
}) => (
  <div style={{ height: `${height}px` }}>
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={margin}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={colors}
      enableGridX={enableGridX}
      enableGridY={enableGridY}
      enableLabel={enableLabel}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#ffffff"
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      animate={true}
      motionConfig="gentle"
      theme={{
        background: 'transparent',
        textColor: 'hsl(var(--foreground))',
        fontSize: 12,
        axis: {
          domain: {
            line: {
              stroke: 'hsl(var(--border))',
              strokeWidth: 1
            }
          },
          legend: {
            text: {
              fontSize: 12,
              fill: 'hsl(var(--foreground))'
            }
          },
          ticks: {
            line: {
              stroke: 'hsl(var(--border))',
              strokeWidth: 1
            },
            text: {
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))'
            }
          }
        },
        grid: {
          line: {
            stroke: 'hsl(var(--border))',
            strokeWidth: 1,
            strokeOpacity: 0.5
          }
        }
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  </div>
)
type ChartLineProps = {
  data: Serie[]
  colors?: string[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  enableGridX?: boolean
  enableGridY?: boolean
  enablePoints?: boolean
  pointSize?: number
  enableArea?: boolean
  axisBottom?: {
    format?: string
    tickRotation?: number
  }
  axisLeft?: {
    format?: string
  }
}

const ChartLine: FC<ChartLineProps> = ({
  data,
  colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  height = 400,
  margin = { top: 50, right: 110, bottom: 50, left: 60 },
  enableGridX = false,
  enableGridY = true,
  enablePoints = true,
  pointSize = 6,
  enableArea = false,
  axisBottom = {},
  axisLeft = {}
}) => (
  <div style={{ height: `${height}px` }}>
    <ResponsiveLine
      data={data}
      margin={margin}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false
      }}
      yFormat=" >-.2f"
      colors={colors}
      enableGridX={enableGridX}
      enableGridY={enableGridY}
      enablePoints={enablePoints}
      pointSize={pointSize}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableArea={enableArea}
      areaOpacity={0.1}
      useMesh={true}
      curve="catmullRom"
      animate={true}
      motionConfig="gentle"
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      theme={{
        background: 'transparent',
        textColor: 'hsl(var(--foreground))',
        fontSize: 12,
        axis: {
          domain: {
            line: {
              stroke: 'hsl(var(--border))',
              strokeWidth: 1
            }
          },
          legend: {
            text: {
              fontSize: 12,
              fill: 'hsl(var(--foreground))'
            }
          },
          ticks: {
            line: {
              stroke: 'hsl(var(--border))',
              strokeWidth: 1
            },
            text: {
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))'
            }
          }
        },
        grid: {
          line: {
            stroke: 'hsl(var(--border))',
            strokeWidth: 1,
            strokeOpacity: 0.5
          }
        }
      }}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  </div>
)
type ChartPieProps = {
  data: PieDatum[]
  colors?: string[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  innerRadius?: number
  padAngle?: number
  enableArcLinkLabels?: boolean
  enableArcLabels?: boolean
}

const ChartPie: FC<ChartPieProps> = ({
  data,
  colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 400,
  margin = { top: 40, right: 80, bottom: 80, left: 80 },
  innerRadius = 0.5,
  padAngle = 0.7,
  enableArcLinkLabels = true,
  enableArcLabels = false
}) => (
  <div style={{ height: `${height}px` }}>
    <ResponsivePie
      data={data}
      margin={margin}
      innerRadius={innerRadius}
      padAngle={padAngle}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={colors}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            0.2
          ]
        ]
      }}
      enableArcLinkLabels={enableArcLinkLabels}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="hsl(var(--foreground))"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      enableArcLabels={enableArcLabels}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            2
          ]
        ]
      }}
      animate={true}
      motionConfig="gentle"
      theme={{
        background: 'transparent',
        textColor: 'hsl(var(--foreground))',
        fontSize: 12,
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: 'hsl(var(--foreground))',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 12,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: 'hsl(var(--foreground))'
              }
            }
          ]
        }
      ]}
    />
  </div>
)
type ChartCalendarProps = {
  data: CalendarDatum[]
  from: string
  to: string
  colors?: string[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  monthBorderColor?: string
  dayBorderColor?: string
  emptyColor?: string
}

const ChartCalendar: FC<ChartCalendarProps> = ({
  data,
  from,
  to,
  colors = ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  height = 260,
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  monthBorderColor = 'hsl(var(--border))',
  dayBorderColor = 'hsl(var(--background))',
  emptyColor = 'hsl(var(--muted))'
}) => (
  <div style={{ height: `${height}px` }}>
    <ResponsiveCalendar
      data={data}
      from={from}
      to={to}
      emptyColor={emptyColor}
      colors={colors}
      margin={margin}
      yearSpacing={40}
      monthBorderColor={monthBorderColor}
      dayBorderWidth={2}
      dayBorderColor={dayBorderColor}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'row',
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: 'right-to-left'
        }
      ]}
      theme={{
        background: 'transparent',
        textColor: 'hsl(var(--foreground))',
        fontSize: 11,
      }}
    />
  </div>
)
export const Chart = Object.assign(ChartContainer, {
  Container: ChartContainer,
  Bar: ChartBar,
  Line: ChartLine,
  Pie: ChartPie,
  Calendar: ChartCalendar
})

export { ChartContainer, ChartBar, ChartLine, ChartPie, ChartCalendar }
