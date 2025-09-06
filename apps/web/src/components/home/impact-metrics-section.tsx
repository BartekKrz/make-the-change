'use client'

import { Card, CardContent } from '@/app/admin/(dashboard)/components/ui/card'
import { motion } from 'framer-motion'
import { TreePine, Flower, Zap, Users } from 'lucide-react'
import type { FC } from 'react'

type ImpactMetrics = {
  treesPlanted: number
  beehivesSupported: number
  co2Offset: number
  localJobs: number
}

type ImpactMetricsSectionProps = {
  metrics?: ImpactMetrics
}

export const ImpactMetricsSection: FC<ImpactMetricsSectionProps> = ({ metrics }) => {
  const defaultMetrics: ImpactMetrics = {
    treesPlanted: 1250,
    beehivesSupported: 45,
    co2Offset: 1200,
    localJobs: 320
  }

  const data = metrics || defaultMetrics

  const impactData = [
    {
      icon: TreePine,
      label: "Arbres Plantés",
      value: data.treesPlanted.toLocaleString(),
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-500/10"
    },
    {
      icon: Flower,
      label: "Ruches Soutenues",
      value: data.beehivesSupported.toString(),
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10"
    },
    {
      icon: Zap,
      label: "CO₂ Compensé (kg)",
      value: `${(data.co2Offset / 1000).toFixed(1)}t`,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Users,
      label: "Emplois Locaux Créés",
      value: data.localJobs.toString(),
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Notre Impact Environnemental
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ensemble, nous créons un impact positif mesurable sur l&apos;environnement et les communautés locales
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {impactData.map((impact, index) => {
          const Icon = impact.icon
          return (
            <motion.div
              key={impact.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4, type: "spring", stiffness: 100 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 group border-border/50 bg-background/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${impact.bg} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 bg-gradient-to-r ${impact.gradient} bg-clip-text`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${impact.gradient} bg-clip-text text-transparent mb-2`}>
                    {impact.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium leading-tight">
                    {impact.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full border border-green-500/20">
          <Zap className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">
            Impact calculé en temps réel depuis nos partenaires
          </span>
        </div>
      </motion.div>
    </section>
  )
}
