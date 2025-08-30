export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Faites le <span className="text-primary">CHANGEMENT</span>
        </h1>
        <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
          Investissez dans des projets écologiques durables et découvrez des produits 
          qui transforment notre planète, un geste à la fois.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Découvrir les Projets
          </button>
          <button className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors">
            Visiter la Boutique
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-surface rounded-lg">
          <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            🌱
          </div>
          <h3 className="text-xl font-semibold mb-2">Projets Écologiques</h3>
          <p className="text-muted">
            Investissez dans des ruches, oliviers et projets durables 
            avec des retours concrets et mesurables.
          </p>
        </div>

        <div className="text-center p-6 bg-surface rounded-lg">
          <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
            🛒
          </div>
          <h3 className="text-xl font-semibold mb-2">Boutique Éthique</h3>
          <p className="text-muted">
            Découvrez des produits locaux et durables directement 
            des producteurs partenaires.
          </p>
        </div>

        <div className="text-center p-6 bg-surface rounded-lg">
          <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            📊
          </div>
          <h3 className="text-xl font-semibold mb-2">Impact Mesurable</h3>
          <p className="text-muted">
            Suivez l&apos;impact de vos investissements avec des métriques 
            transparentes et vérifiées.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-8">Notre Impact Ensemble</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1,250</div>
            <div className="text-muted">Arbres plantés</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">45</div>
            <div className="text-muted">Ruches installées</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">€125k</div>
            <div className="text-muted">Investis localement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">320</div>
            <div className="text-muted">Membres actifs</div>
          </div>
        </div>
      </section>
    </div>
  )
}
