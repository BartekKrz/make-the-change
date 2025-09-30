'use client';

import { motion } from 'framer-motion';
import { TreePine, Flower, Zap, Users } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';

import type { FC } from 'react';

type ImpactMetrics = {
  treesPlanted: number;
  beehivesSupported: number;
  co2Offset: number;
  localJobs: number;
};

type ImpactMetricsSectionProps = {
  metrics?: ImpactMetrics;
};

export const ImpactMetricsSection: FC<ImpactMetricsSectionProps> = ({
  metrics,
}) => {
  const defaultMetrics: ImpactMetrics = {
    treesPlanted: 1250,
    beehivesSupported: 45,
    co2Offset: 1200,
    localJobs: 320,
  };

  const data = metrics || defaultMetrics;

  const impactData = [
    {
      icon: TreePine,
      label: 'Arbres Plantés',
      value: data.treesPlanted.toLocaleString(),
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
    },
    {
      icon: Flower,
      label: 'Ruches Soutenues',
      value: data.beehivesSupported.toString(),
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-500/10',
    },
    {
      icon: Zap,
      label: 'CO₂ Compensé (kg)',
      value: `${(data.co2Offset / 1000).toFixed(1)}t`,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Users,
      label: 'Emplois Locaux Créés',
      value: data.localJobs.toString(),
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="container mx-auto bg-gradient-to-br from-green-50/50 to-blue-50/50 px-4 py-16 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="mb-12 text-center">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Notre Impact Environnemental
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ensemble, nous créons un impact positif mesurable sur
          l&apos;environnement et les communautés locales
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {impactData.map((impact, index) => {
          const Icon = impact.icon;
          return (
            <motion.div
              key={impact.label}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: index * 0.1 + 0.4,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <Card className="group border-border/50 bg-background/60 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div
                    className={`h-16 w-16 ${impact.bg} mx-auto mb-4 flex items-center justify-center rounded-full transition-transform group-hover:scale-110`}
                  >
                    <Icon
                      className={`h-8 w-8 bg-gradient-to-r ${impact.gradient} bg-clip-text`}
                    />
                  </div>
                  <div
                    className={`bg-gradient-to-r text-2xl font-bold md:text-3xl ${impact.gradient} mb-2 bg-clip-text text-transparent`}
                  >
                    {impact.value}
                  </div>
                  <div className="text-muted-foreground text-xs leading-tight font-medium md:text-sm">
                    {impact.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10 px-6 py-3">
          <Zap className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">
            Impact calculé en temps réel depuis nos partenaires
          </span>
        </div>
      </motion.div>
    </section>
  );
};
