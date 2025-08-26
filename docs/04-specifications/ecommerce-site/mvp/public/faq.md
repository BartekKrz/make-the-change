# FAQ - Questions Fréquentes

## 🎯 Objectif

Répondre de manière exhaustive et accessible aux questions les plus fréquentes des utilisateurs sur Make the CHANGE, réduisant ainsi le volume de support et améliorant l'autonomie utilisateur.

## 👤 Utilisateurs Cibles

- **Prospects** : Compréhension du modèle avant investissement
- **Nouveaux utilisateurs** : Guide d'utilisation de la plateforme
- **Utilisateurs existants** : Résolution de problèmes courants
- **Indécis** : Levée des objections et inquiétudes

## 🎨 Design & Layout

### Structure de Page

```jsx
<div className="min-h-screen bg-white">
  {/* Hero Section */}
  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Centre d'Aide
      </h1>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Trouvez rapidement les réponses à vos questions sur Make the CHANGE
      </p>
      
      {/* Barre de recherche */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher dans la FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-white text-slate-900 rounded-lg"
          />
        </div>
        
        {/* Suggestions populaires */}
        {searchQuery === '' && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {popularSearches.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(search)}
                className="border-white/30 text-white hover:bg-white hover:text-blue-600"
              >
                {search}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  
  {/* Navigation par catégories */}
  <div className="sticky top-0 bg-white border-b border-slate-200 py-4 z-40">
    <div className="container mx-auto px-4">
      <nav className="flex space-x-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span className="font-medium">{category.name}</span>
            <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">
              {category.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  </div>
  
  {/* Contenu principal */}
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar - Catégories détaillées */}
      <div className="lg:col-span-1">
        <div className="sticky top-32">
          <h3 className="font-semibold text-slate-900 mb-4">Catégories</h3>
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-1">
                  {category.count}
                </span>
              </button>
            ))}
          </nav>
          
          {/* Contact support */}
          <div className="mt-8 bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Besoin d'aide personnalisée ?
            </h4>
            <p className="text-green-700 text-sm mb-3">
              Notre équipe support est là pour vous
            </p>
            <Button size="sm" className="w-full" asChild>
              <Link href="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <div className="lg:col-span-3">
        {filteredQuestions.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="space-y-6">
            {/* Résultats de recherche */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-slate-600">
                  <span className="font-medium">{filteredQuestions.length}</span> résultat(s) 
                  pour "<span className="font-medium">{searchQuery}</span>"
                </p>
              </div>
            )}
            
            {/* Questions les plus populaires */}
            {!searchQuery && activeCategory === 'all' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  🔥 Questions les Plus Populaires
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => scrollToQuestion(question.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
                            {question.question}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2">
                            {question.answer.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="ml-3 flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {question.views} vues
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Accordion FAQ */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeCategory === 'all' 
                    ? 'Toutes les Questions' 
                    : categories.find(c => c.id === activeCategory)?.name
                  }
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">Trier par :</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularité</SelectItem>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="alphabetical">Alphabétique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((item, index) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="bg-white border border-slate-200 rounded-lg px-6 hover:border-blue-300 transition-colors"
                  >
                    <AccordionTrigger className="text-left hover:no-underline group">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-start space-x-3">
                          <span className="text-sm font-mono text-slate-400 mt-1">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.question}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                                {categories.find(c => c.id === item.category)?.name}
                              </span>
                              {item.isNew && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Nouveau
                                </span>
                              )}
                              {item.isPopular && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Populaire
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="prose prose-slate max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                        
                        {/* Actions utilisateur */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 not-prose">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleFeedback(item.id, 'helpful')}
                                className={`flex items-center space-x-1 text-sm ${
                                  feedback[item.id] === 'helpful'
                                    ? 'text-green-600'
                                    : 'text-slate-500 hover:text-green-600'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Utile ({item.helpfulCount})</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(item.id, 'not-helpful')}
                                className={`flex items-center space-x-1 text-sm ${
                                  feedback[item.id] === 'not-helpful'
                                    ? 'text-red-600'
                                    : 'text-slate-500 hover:text-red-600'
                                }`}
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>Pas utile</span>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => shareQuestion(item.id)}
                              className="flex items-center space-x-1 text-sm text-slate-500 hover:text-blue-600"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Partager</span>
                            </button>
                          </div>
                          
                          <div className="text-xs text-slate-400">
                            Mis à jour le {formatDate(item.updatedAt)}
                          </div>
                        </div>
                        
                        {/* Articles liés */}
                        {item.relatedArticles && item.relatedArticles.length > 0 && (
                          <div className="mt-6 p-4 bg-slate-50 rounded-lg not-prose">
                            <h4 className="font-medium text-slate-900 mb-3">
                              Articles liés
                            </h4>
                            <div className="space-y-2">
                              {item.relatedArticles.map((article) => (
                                <Link
                                  key={article.id}
                                  href={article.url}
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-3 h-3 mr-2" />
                                  {article.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        )}
      </div>
    </div>
  </div>
  
  {/* Section d'aide supplémentaire */}
  <section className="bg-slate-50 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Vous ne trouvez pas votre réponse ?
        </h2>
        <p className="text-lg text-slate-600">
          Notre équipe support est là pour vous aider
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Chat en Direct</h3>
          <p className="text-slate-600 text-sm mb-4">
            Discutez avec notre équipe en temps réel
          </p>
          <Button variant="outline" size="sm">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Démarrer le chat
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
          <p className="text-slate-600 text-sm mb-4">
            Réponse garantie sous 4h
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:support@makethechange.fr">
              Envoyer un email
            </a>
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Rendez-vous</h3>
          <p className="text-slate-600 text-sm mb-4">
            Conseil personnalisé gratuit
          </p>
          <Button variant="outline" size="sm">
            Réserver un créneau
          </Button>
        </div>
      </div>
    </div>
  </section>
</div>
```

## 📋 Contenu des Questions

### 1. Catégorie : Comprendre Make the CHANGE

```typescript
const understandingQuestions = [
  {
    id: "what-is-make-the-change",
    question: "Qu'est-ce que Make the CHANGE ?",
    answer: `
      <p>Make the CHANGE est une plateforme révolutionnaire qui propose un modèle économique "Invest-to-Earn" pour la préservation de la biodiversité.</p>
      
      <h4>🌱 Notre Mission</h4>
      <p>Nous réconcilions profit et impact environnemental en permettant à chacun d'investir dans des projets concrets de biodiversité tout en bénéficiant d'un retour immédiat sous forme de produits durables.</p>
      
      <h4>💡 Comment ça marche en 3 étapes :</h4>
      <ol>
        <li><strong>Investissez</strong> : Choisissez un projet de biodiversité qui vous tient à cœur (ex: Ruche 50€, Olivier 80€)</li>
        <li><strong>Recevez des points</strong> : Obtenez immédiatement des points bonus (30-50% de votre investissement)</li>
        <li><strong>Profitez</strong> : Utilisez vos points pour obtenir des produits durables de nos partenaires, livrés gratuitement</li>
      </ol>
      
      <div class="bg-green-50 border-l-4 border-green-400 p-4 my-4">
        <p class="text-green-800"><strong>💚 Impact concret :</strong> Chaque euro investi finance directement des projets de reforestation, d'apiculture durable, d'agriculture biologique et de préservation des écosystèmes.</p>
      </div>
      
      <p>Contrairement aux investissements traditionnels, vous bénéficiez immédiatement de votre mise tout en créant un impact positif mesurable sur l'environnement.</p>
    `,
    category: "understanding",
    isPopular: true,
    helpfulCount: 342,
    views: 1250
  },
  
  {
    id: "how-invest-to-earn-works",
    question: "Comment fonctionne le modèle 'Invest-to-Earn' ?",
    answer: `
      <p>Le modèle "Invest-to-Earn" de Make the CHANGE transforme l'investissement traditionnel en créant un écosystème où tout le monde gagne : vous, les producteurs et l'environnement.</p>
      
      <h4>🔄 Le Cycle Vertueux</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-semibold text-blue-800 mb-2">Votre Investissement (100%)</h5>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>• 80% → Points pour vous</li>
            <li>• 15% → Financement du projet</li>
            <li>• 5% → Frais de fonctionnement</li>
          </ul>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h5 class="font-semibold text-green-800 mb-2">Vos Bénéfices</h5>
          <ul class="text-green-700 text-sm space-y-1">
            <li>• Produits durables (valeur réelle)</li>
            <li>• Impact environnemental traçable</li>
            <li>• Satisfaction d'agir pour la planète</li>
            <li>• Découverte de producteurs locaux</li>
          </ul>
        </div>
      </div>
      
      <h4>🏆 Avantages vs Investissement Classique</h4>
      <table class="w-full border border-slate-200 rounded-lg my-4">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left p-3">Critère</th>
            <th class="text-center p-3 text-green-600">Make the CHANGE</th>
            <th class="text-center p-3 text-slate-500">Investissement classique</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t">
            <td class="p-3">Retour sur investissement</td>
            <td class="p-3 text-center text-green-600">✅ Points bonus immédiats</td>
            <td class="p-3 text-center text-slate-500">⏰ Incertain</td>
          </tr>
          <tr class="border-t">
            <td class="p-3">Impact environnemental</td>
            <td class="p-3 text-center text-green-600">✅ Garanti et mesurable</td>
            <td class="p-3 text-center text-slate-500">❌ Variable ou inexistant</td>
          </tr>
          <tr class="border-t">
            <td class="p-3">Risque de perte</td>
            <td class="p-3 text-center text-green-600">✅ Très faible</td>
            <td class="p-3 text-center text-slate-500">⚠️ Élevé</td>
          </tr>
        </tbody>
      </table>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <p class="text-yellow-800"><strong>⚠️ Important :</strong> Make the CHANGE n'est pas un produit financier réglementé. C'est un modèle économique innovant qui privilégie l'impact et la satisfaction immédiate plutôt que la spéculation financière.</p>
      </div>
    `,
    category: "understanding",
    isPopular: true,
    helpfulCount: 256,
    views: 890
  }
];
```

### 2. Catégorie : Investissements

```typescript
const investmentQuestions = [
  {
    id: "investment-amounts",
    question: "Quels sont les montants d'investissement disponibles ?",
    answer: `
      <p>Make the CHANGE propose des options d'investissement adaptées à chaque projet et budget :</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div class="text-2xl font-bold text-green-800 mb-2">Ruche (50€)</div>
        <div class="text-green-600 font-medium mb-3">65 points</div>
        <ul class="text-green-700 text-sm space-y-1">
          <li>• Soutien direct apiculteur</li>
          <li>• 2kg CO₂ compensé</li>
          <li>• 1 pot de miel tracé</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center border-2 border-blue-400">
        <div class="text-2xl font-bold text-blue-800 mb-2">Olivier (80€)</div>
        <div class="text-blue-600 font-medium mb-3">105 points</div>
        <ul class="text-blue-700 text-sm space-y-1">
          <li>• Reforestation Madagascar</li>
          <li>• 5kg CO₂ compensé</li>
          <li>• 1 bouteille huile d'olive</li>
        </ul>
      </div>
      
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <div class="text-2xl font-bold text-purple-800 mb-2">Parcelle (150€)</div>
        <div class="text-purple-600 font-medium mb-3">210 points</div>
        <ul class="text-purple-700 text-sm space-y-1">
          <li>• Biodiversité locale</li>
          <li>• 10kg CO₂ compensé</li>
          <li>• Panier produits variés</li>
        </ul>
      </div>
    </div>
    
    <h4>🎯 Comment choisir ?</h4>
    <ul class="space-y-2 my-4">
      <li><strong>Ruche (50€)</strong> : Idéal pour un premier engagement et découvrir l'apiculture</li>
      <li><strong>Olivier (80€)</strong> : Pour un impact durable sur la reforestation et l'agroforesterie</li>
      <li><strong>Parcelle (150€)</strong> : Pour un soutien plus large à la biodiversité et une diversité de récompenses</li>
    </ul>
    
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
      <p class="text-blue-800"><strong>💡 Astuce :</strong> Vous pouvez réaliser plusieurs investissements et les cumuler. Beaucoup de nos utilisateurs commencent par une ruche puis diversifient leurs soutiens.</p>
    </div>
    
    <h4>💳 Moyens de paiement acceptés</h4>
    <ul class="space-y-1 my-4">
      <li>• Cartes bancaires (Visa, Mastercard, American Express)</li>
      <li>• Apple Pay et Google Pay</li>
      <li>• Virements bancaires (pour montants >300€)</li>
      <li>• Paiement en 3 fois sans frais (à partir de 300€)</li>
    </ul>
    `,
    category: "investment",
    isPopular: true,
    helpfulCount: 189,
    views: 750
  },
  
  {
    id: "project-selection",
    question: "Comment choisir le bon projet pour mon investissement ?",
    answer: `
      <p>Le choix du projet est crucial car il détermine l'impact concret de votre investissement. Voici notre guide pour faire le meilleur choix :</p>
      
      <h4>🔍 Critères de Sélection</h4>
      
      <div class="space-y-4 my-6">
        <div class="bg-green-50 border-l-4 border-green-400 p-4">
          <h5 class="font-semibold text-green-800 mb-2">🌱 Type d'Impact</h5>
          <ul class="text-green-700 text-sm space-y-1">
            <li>• <strong>Reforestation</strong> : Plantation d'arbres, restauration forestière</li>
            <li>• <strong>Apiculture</strong> : Protection des abeilles, biodiversité pollinisateurs</li>
            <li>• <strong>Agriculture bio</strong> : Conversion vers des pratiques durables</li>
            <li>• <strong>Océans</strong> : Protection marine, aquaculture responsable</li>
          </ul>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
          <h5 class="font-semibold text-blue-800 mb-2">📍 Localisation</h5>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>• <strong>France métropolitaine</strong> : Impact local, traçabilité maximale</li>
            <li>• <strong>Europe</strong> : Projets transfrontaliers, échange de bonnes pratiques</li>
            <li>• <strong>International</strong> : Projets à fort impact dans pays en développement</li>
          </ul>
        </div>
        
        <div class="bg-purple-50 border-l-4 border-purple-400 p-4">
          <h5 class="font-semibold text-purple-800 mb-2">⏱️ Durée du Projet</h5>
          <ul class="text-purple-700 text-sm space-y-1">
            <li>• <strong>Court terme (6-12 mois)</strong> : Résultats rapides, suivi fréquent</li>
            <li>• <strong>Moyen terme (1-3 ans)</strong> : Impact structurel, transformation durable</li>
            <li>• <strong>Long terme (3+ ans)</strong> : Projets ambitieux, impact générationnel</li>
          </ul>
        </div>
      </div>
      
      <h4>📊 Métriques d'Impact à Analyser</h4>
      <table class="w-full border border-slate-200 rounded-lg my-4">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left p-3">Métrique</th>
            <th class="text-left p-3">Signification</th>
            <th class="text-left p-3">Valeur de référence</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr class="border-t">
            <td class="p-3 font-medium">CO₂ compensé</td>
            <td class="p-3">Quantité de carbone capturée/évitée</td>
            <td class="p-3 text-green-600">5-20kg par €150 investi</td>
          </tr>
          <tr class="border-t">
            <td class="p-3 font-medium">Biodiversité</td>
            <td class="p-3">Nombre d'espèces protégées/restaurées</td>
            <td class="p-3 text-green-600">3-10 espèces impactées</td>
          </tr>
          <tr class="border-t">
            <td class="p-3 font-medium">Emplois créés</td>
            <td class="p-3">Postes générés dans l'économie locale</td>
            <td class="p-3 text-green-600">0.1-0.5 emploi par projet</td>
          </tr>
          <tr class="border-t">
            <td class="p-3 font-medium">Surface impactée</td>
            <td class="p-3">Hectares restaurés/protégés</td>
            <td class="p-3 text-green-600">100-1000m² par €150</td>
          </tr>
        </tbody>
      </table>
      
      <h4>🏆 Nos Projets Phares</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="border border-slate-200 rounded-lg p-4">
          <h5 class="font-semibold text-slate-900 mb-2">🌳 Forêt des Landes</h5>
          <p class="text-slate-600 text-sm mb-2">Reforestation après incendies • France</p>
          <div class="text-xs text-green-600">15kg CO₂/€150 • 500 arbres plantés</div>
        </div>
        <div class="border border-slate-200 rounded-lg p-4">
          <h5 class="font-semibold text-slate-900 mb-2">🐝 Ruches de Provence</h5>
          <p class="text-slate-600 text-sm mb-2">Protection des abeilles • France</p>
          <div class="text-xs text-green-600">8kg CO₂/€150 • 10 ruches soutenues</div>
        </div>
      </div>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <p class="text-yellow-800"><strong>💡 Conseil :</strong> Consultez les avis d'autres investisseurs et les rapports d'impact réguliers pour affiner votre choix. Notre équipe peut aussi vous conseiller par téléphone.</p>
      </div>
    `,
    category: "investment",
    helpfulCount: 145,
    views: 520
  }
];
```

### 3. Catégorie : Système de Points

```typescript
const pointsQuestions = [
  {
    id: "points-expiry",
    question: "Mes points ont-ils une date d'expiration ?",
    answer: `
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span class="text-red-600 text-sm font-bold">!</span>
          </div>
          <div>
            <h4 class="font-semibold text-red-800 mb-2">⏰ Oui, vos points expirent après 18 mois</h4>
            <p class="text-red-700 text-sm">Cette durée démarre à partir de la date d'attribution de vos points (date de confirmation de votre investissement).</p>
          </div>
        </div>
      </div>
      
      <h4>📅 Pourquoi cette limitation ?</h4>
      <p>La durée de validité de 18 mois permet de :</p>
      <ul class="space-y-2 my-4">
        <li>• <strong>Maintenir un écosystème dynamique</strong> avec nos partenaires producteurs</li>
        <li>• <strong>Assurer la fraîcheur des produits</strong> et leur disponibilité</li>
        <li>• <strong>Encourager l'utilisation active</strong> des points pour maximiser votre satisfaction</li>
        <li>• <strong>Éviter l'accumulation excessive</strong> qui pourrait déséquilibrer notre modèle économique</li>
      </ul>
      
      <h4>🔔 Suivi de l'Expiration</h4>
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <p class="text-blue-800">Nous vous aidons à ne rien perdre :</p>
        <ul class="text-blue-700 text-sm space-y-1 mt-2">
          <li>• <strong>Notifications automatiques</strong> : 90, 60, 30 et 7 jours avant expiration</li>
          <li>• <strong>Dashboard personnalisé</strong> : Visualisation claire de vos points et dates d'expiration</li>
          <li>• <strong>Suggestions produits</strong> : Recommandations basées sur vos points disponibles</li>
          <li>• <strong>Alertes par email et SMS</strong> : Rappels pour utiliser vos points à temps</li>
        </ul>
      </div>
      
      <h4>💡 Conseils pour Optimiser vos Points</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-green-50 rounded-lg p-4">
          <h5 class="font-semibold text-green-800 mb-2">✅ Bonnes Pratiques</h5>
          <ul class="text-green-700 text-sm space-y-1">
            <li>• Utilisez le principe FIFO (premiers arrivés, premiers utilisés)</li>
            <li>• Commandez régulièrement plutôt qu'attendre</li>
            <li>• Surveillez les offres limitées et nouveautés</li>
            <li>• Planifiez vos commandes selon les saisons</li>
          </ul>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4">
          <h5 class="font-semibold text-yellow-800 mb-2">⚠️ À Éviter</h5>
          <ul class="text-yellow-700 text-sm space-y-1">
            <li>• Laisser dormir vos points sans les utiliser</li>
            <li>• Attendre le dernier moment pour commander</li>
            <li>• Ignorer les notifications d'expiration</li>
            <li>• Cumuler trop de points d'un coup</li>
          </ul>
        </div>
      </div>
      
      <h4>📱 Outil de Gestion dans votre Dashboard</h4>
      <p>Votre espace personnel affiche :</p>
      <ul class="space-y-1 my-4">
        <li>• <strong>Chronologie de vos points</strong> : Date d'attribution et d'expiration</li>
        <li>• <strong>Calculateur automatique</strong> : Produits accessibles avec vos points actuels</li>
        <li>• <strong>Historique complet</strong> : Toutes vos transactions et utilisations</li>
        <li>• <strong>Prédictions</strong> : Estimation de vos futurs points selon vos habitudes</li>
      </ul>
      
      <div class="bg-orange-50 border-l-4 border-orange-400 p-4 my-4">
        <p class="text-orange-800"><strong>❌ Important :</strong> Aucun remboursement, prolongation ou compensation n'est possible pour les points expirés. Cette politique est clairement mentionnée dans nos CGU et confirmée à chaque investissement.</p>
      </div>
    `,
    category: "points",
    isPopular: true,
    helpfulCount: 298,
    views: 1100
  }
];
```

## 🔍 Fonctionnalités Avancées

### Recherche Intelligente

```typescript
// Recherche avec IA et autocomplétion
const searchFunctionality = {
  // Recherche sémantique
  semanticSearch: (query: string) => {
    return fuse.search(query, {
      keys: ['question', 'answer', 'tags'],
      threshold: 0.3,
      includeScore: true
    });
  },
  
  // Suggestions en temps réel
  autoComplete: (input: string) => {
    const suggestions = [];
    
    // Mots-clés populaires
    const keywords = ['points', 'investissement', 'expiration', 'produits', 'livraison'];
    keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push({ type: 'keyword', value: keyword });
      }
    });
    
    // Questions similaires
    const similarQuestions = faqData
      .filter(q => q.question.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 3)
      .map(q => ({ type: 'question', value: q.question, id: q.id }));
    
    return [...suggestions, ...similarQuestions];
  },
  
  // Recherche par tags
  searchByTags: (tags: string[]) => {
    return faqData.filter(item => 
      tags.some(tag => item.tags?.includes(tag))
    );
  }
};
```

### Analytics & Amélioration

```typescript
// Tracking comportement utilisateur
const faqAnalytics = {
  // Questions les plus recherchées
  trackSearch: (query: string, results: number) => {
    gtag('event', 'faq_search', {
      search_term: query,
      results_count: results
    });
  },
  
  // Feedback utilisateur
  trackFeedback: (questionId: string, helpful: boolean) => {
    gtag('event', 'faq_feedback', {
      question_id: questionId,
      helpful: helpful
    });
  },
  
  // Questions manquantes
  trackMissingQuestion: (query: string) => {
    // Suggestion automatique de nouvelle FAQ
    gtag('event', 'faq_missing', {
      search_term: query
    });
  }
};
```

---

**Stack Technique** : Vercel Edge Functions + Fuse.js + Framer Motion + Analytics  
**Priorité** : 🔥 Importante - Réduction charge support  
**Estimation** : 5-6 jours développement + rédaction contenu
