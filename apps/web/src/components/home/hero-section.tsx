'use client';

import { motion } from 'framer-motion';

import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';

import type { FC } from 'react';

export const HeroSection: FC = () => {
  return (
    <section className="from-background via-muted/5 to-background relative overflow-hidden bg-gradient-to-br pt-20 pb-16">
      {/* Background avec effet grid */}
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]" />

      {/* Éléments décoratifs */}
      <div className="bg-primary/10 absolute top-20 left-10 h-20 w-20 rounded-full blur-xl" />
      <div className="bg-accent/10 absolute right-10 bottom-20 h-32 w-32 rounded-full blur-xl" />

      <div className="relative container mx-auto px-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Faites le{' '}
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              CHANGEMENT
            </span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Investissez dans des projets écologiques durables et découvrez des
            produits qui transforment notre planète, un geste à la fois.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              className="h-14 px-8 shadow-lg transition-all hover:shadow-xl"
              size="lg"
            >
              <LocalizedLink href="/projects">
                Découvrir les Projets
              </LocalizedLink>
            </Button>
            <Button
              asChild
              className="hover:bg-primary/5 h-14 border-2 px-8"
              size="lg"
              variant="outline"
            >
              <LocalizedLink href="/shop">Visiter la Boutique</LocalizedLink>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
