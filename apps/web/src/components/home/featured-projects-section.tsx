'use client';

import { motion } from 'framer-motion';
import { MapPin, Target, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';

import type { FC } from 'react';

type FeaturedProject = {
  id: string;
  name: string;
  location: string;
  type: 'beehive' | 'olive' | 'reforestation';
  fundingGoal: number;
  currentFunding: number;
  roi: number;
  duration: string;
  description: string;
  image?: string;
};

type FeaturedProjectsSectionProps = {
  projects?: FeaturedProject[];
};

export const FeaturedProjectsSection: FC<FeaturedProjectsSectionProps> = ({
  projects,
}) => {
  const defaultProjects: FeaturedProject[] = [
    {
      id: '1',
      name: 'Ruches HABEEBEE Gand',
      location: 'Gand, Belgique',
      type: 'beehive',
      fundingGoal: 50_000,
      currentFunding: 35_000,
      roi: 8.5,
      duration: '18 mois',
      description:
        'Développement apicole durable avec retour garanti et impact environnemental mesurable.',
    },
    {
      id: '2',
      name: 'Oliviers ILANGA Madagascar',
      location: 'Madagascar',
      type: 'olive',
      fundingGoal: 75_000,
      currentFunding: 45_000,
      roi: 12,
      duration: '24 mois',
      description:
        'Plantation d&apos;oliviers créant des emplois locaux et produisant une huile premium.',
    },
    {
      id: '3',
      name: 'Parcelles Familiales PROMIEL',
      location: 'Luxembourg',
      type: 'reforestation',
      fundingGoal: 30_000,
      currentFunding: 28_000,
      roi: 6,
      duration: '12 mois',
      description:
        'Reforestation avec parcelles familiales et production de miel artisanal.',
    },
  ];

  const data = projects || defaultProjects;

  const getProjectIcon = (type: FeaturedProject['type']) => {
    switch (type) {
      case 'beehive': {
        return '🐝';
      }
      case 'olive': {
        return '🫒';
      }
      case 'reforestation': {
        return '🌳';
      }
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Projets en Vedette
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Découvrez nos projets phares et rejoignez une communauté engagée pour
          un avenir durable
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((project, index) => {
          const fundingPercentage =
            (project.currentFunding / project.fundingGoal) * 100;

          return (
            <motion.div
              key={project.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card className="group border-border/50 bg-background/60 h-full backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-transform group-hover:scale-110">
                        {getProjectIcon(project.type)}
                      </span>
                      <div>
                        <h3 className="text-lg leading-tight font-bold">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Target className="text-primary h-4 w-4" />
                    <span className="font-medium">
                      {fundingPercentage.toFixed(0)}% financé
                    </span>
                    <span className="text-muted-foreground">
                      ({project.currentFunding.toLocaleString()}€ /{' '}
                      {project.fundingGoal.toLocaleString()}€)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-green-600">
                      ROI: {project.roi}% sur {project.duration}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="from-primary to-accent h-full bg-gradient-to-r transition-all duration-500"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    size="sm"
                    variant="outline"
                  >
                    <Link href={`/projects/${project.id}`}>En savoir plus</Link>
                  </Button>
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/projects/${project.id}/invest`}>
                      Investir maintenant
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/projects">Voir tous les projets</Link>
        </Button>
      </div>
    </section>
  );
};
