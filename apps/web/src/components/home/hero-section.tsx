'use client'

import { motion } from 'framer-motion'

import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'

import type { FC } from 'react'

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 bg-gradient-to-br from-background via-muted/5 to-background">
      {/* Background avec effet grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Faites le{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CHANGEMENT
            </span>
          </motion.h1>

          <motion.p 
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Investissez dans des projets écologiques durables et découvrez des produits
            qui transforment notre planète, un geste à la fois.
          </motion.p>

          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button asChild className="h-14 px-8 shadow-lg hover:shadow-xl transition-all" size="lg">
              <LocalizedLink href="/projects">Découvrir les Projets</LocalizedLink>
            </Button>
            <Button asChild className="h-14 px-8 border-2 hover:bg-primary/5" size="lg" variant="outline">
              <LocalizedLink href="/shop">Visiter la Boutique</LocalizedLink>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
