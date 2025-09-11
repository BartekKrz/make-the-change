'use client'

import { motion } from 'framer-motion'
import { Users, Euro, Zap, ShoppingBag } from 'lucide-react'

import { Card, CardContent } from '@/app/[locale]/admin/(dashboard)/components/ui/card'

import type { FC } from 'react'

type MetricsProps = {
  metrics?: {
    membersCount: number
    revenueEngaged: number
    pointsActive: number
    ordersThisMonth: number
  }
}

export const KPIMetricsSection: FC<MetricsProps> = ({ metrics }) => {
  const defaultMetrics = {
    membersCount: 1247,
    revenueEngaged: 89_450,
    pointsActive: 71_560,
    ordersThisMonth: 156
  }

  const data = metrics || defaultMetrics

  const metricsData = [
    {
      icon: Users,
      label: "Membres Actifs",
      value: data.membersCount.toLocaleString(),
      gradient: "from-primary to-primary/80"
    },
    {
      icon: Euro,
      label: "Revenus Engagés",
      value: `€${(data.revenueEngaged / 1000).toFixed(0)}k`,
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      label: "Points Actifs",
      value: data.pointsActive.toLocaleString(),
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: ShoppingBag,
      label: "Commandes ce mois",
      value: data.ordersThisMonth.toString(),
      gradient: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <motion.h2 
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Notre Impact Ensemble
        </motion.h2>
        <motion.p 
          animate={{ opacity: 1, y: 0 }}
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Découvrez l&apos;impact de notre communauté en temps réel
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card className="glass-card hover:shadow-xl transition-all duration-300 group border-border/50 bg-background/60 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
