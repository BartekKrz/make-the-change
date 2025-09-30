import { useTranslations } from 'next-intl';

import { FeaturedProjectsSection } from '@/components/home/featured-projects-section';
import { HeroSection } from '@/components/home/hero-section';
import { ImpactMetricsSection } from '@/components/home/impact-metrics-section';
import { KPIMetricsSection } from '@/components/home/kpi-metrics-section';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function HomePage() {
  const t = useTranslations('metadata');

  return (
    <div className="min-h-screen">
      {/* Sélecteur de langue en haut à droite */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section avec métriques temps réel */}
      <HeroSection />

      {/* KPIs Business */}
      <KPIMetricsSection />

      {/* Projets en Vedette */}
      <FeaturedProjectsSection />

      {/* Métriques d'Impact */}
      <ImpactMetricsSection />
    </div>
  );
}
