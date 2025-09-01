import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { HeroSection } from "@/components/home/hero-section";
import { ImpactMetricsSection } from "@/components/home/impact-metrics-section";
import { KPIMetricsSection } from "@/components/home/kpi-metrics-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec métriques temps réel */}
      <HeroSection />
      
      {/* KPIs Business */}
      <KPIMetricsSection />
      
      {/* Projets en Vedette */}
      <FeaturedProjectsSection />
      
      {/* Métriques d'Impact */}
      <ImpactMetricsSection />
    </div>
  )
}
