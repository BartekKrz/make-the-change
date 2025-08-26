# Pages Légales - Site E-commerce

## 🎯 Objectif

Fournir un cadre juridique clair et complet pour la plateforme Make the CHANGE, protégeant à la fois l'entreprise et les utilisateurs tout en respectant les obligations RGPD.

## 📋 Pages Incluses

1. **Conditions Générales d'Utilisation (CGU)**
2. **Politique de Confidentialité**
3. **Conditions Générales de Vente (CGV)**
4. **Mentions Légales**
5. **Politique de Cookies**

---

## 1. CONDITIONS GÉNÉRALES D'UTILISATION

### Structure Page CGU

```jsx
<div className="min-h-screen bg-white">
  {/* Header légal */}
  <div className="bg-slate-50 py-12">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Conditions Générales d'Utilisation
      </h1>
      <div className="flex items-center text-sm text-slate-600">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Dernière mise à jour : 15 décembre 2024</span>
        <span className="mx-2">•</span>
        <span>Version 2.1</span>
      </div>
    </div>
  </div>
  
  {/* Navigation ancres */}
  <div className="sticky top-16 bg-white border-b border-slate-200 py-4 z-40">
    <div className="container mx-auto px-4">
      <nav className="flex space-x-6 overflow-x-auto">
        {[
          { id: 'definitions', label: 'Définitions' },
          { id: 'objet', label: 'Objet' },
          { id: 'acces', label: 'Accès' },
          { id: 'investissement', label: 'Investissement' },
          { id: 'points', label: 'Système de points' },
          { id: 'produits', label: 'Produits' },
          { id: 'responsabilites', label: 'Responsabilités' },
          { id: 'propriete', label: 'Propriété intellectuelle' },
          { id: 'donnees', label: 'Données personnelles' },
          { id: 'duree', label: 'Durée et résiliation' },
          { id: 'litiges', label: 'Litiges' }
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-slate-600 hover:text-blue-600 whitespace-nowrap text-sm font-medium"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  </div>
  
  {/* Contenu principal */}
  <div className="container mx-auto px-4 py-12">
    <div className="max-w-4xl mx-auto prose prose-slate">
      
      {/* 1. Définitions */}
      <section id="definitions" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          1. Définitions
        </h2>
        
        <div className="bg-slate-50 rounded-lg p-6 not-prose">
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold text-slate-900">« Plateforme »</dt>
              <dd className="text-slate-700">Désigne l'ensemble des services Make the CHANGE accessibles via le site web et l'application mobile.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">« Utilisateur »</dt>
              <dd className="text-slate-700">Toute personne physique majeure utilisant la Plateforme.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">« Investissement »</dt>
              <dd className="text-slate-700">Somme versée par l'Utilisateur pour soutenir un projet de biodiversité (ex: Ruche 50€, Olivier 80€, Parcelle 150€).</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">« Points »</dt>
              <dd className="text-slate-700">Unité de compte virtuelle représentant 80% de l'Investissement, utilisable pour obtenir des Produits.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">« Produits »</dt>
              <dd className="text-slate-700">Biens proposés par les Partenaires et accessibles via les Points.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">« Partenaires »</dt>
              <dd className="text-slate-700">Producteurs et fournisseurs sélectionnés proposant des Produits durables.</dd>
            </div>
          </dl>
        </div>
      </section>
      
      {/* 2. Objet */}
      <section id="objet" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          2. Objet et Modèle Économique
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">2.1 Nature du Service</h3>
            <p className="text-slate-700">
              Make the CHANGE propose un modèle économique innovant "Invest-to-Earn" permettant aux Utilisateurs de :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-3">
              <li>Investir dans des projets de préservation de la biodiversité</li>
              <li>Recevoir des Points en contrepartie (80% de l'Investissement)</li>
              <li>Utiliser ces Points pour obtenir des Produits durables</li>
              <li>Suivre l'impact environnemental de leurs Investissements</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800">Important</h4>
                <p className="text-yellow-700 text-sm">
                  Make the CHANGE n'est pas un produit financier réglementé. Les Investissements ne constituent pas des placements financiers au sens du Code monétaire et financier et ne génèrent pas de rendement financier.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">2.2 Montants d'Investissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-800">Ruche (50€)</div>
                <div className="text-sm text-green-600">65 points</div>
                <div className="text-xs text-green-500">2kg CO₂ compensé</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-800">Olivier (80€)</div>
                <div className="text-sm text-blue-600">105 points</div>
                <div className="text-xs text-blue-500">5kg CO₂ compensé</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-purple-800">Parcelle (150€)</div>
                <div className="text-sm text-purple-600">210 points</div>
                <div className="text-xs text-purple-500">10kg CO₂ compensé</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. Accès et Inscription */}
      <section id="acces" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          3. Accès à la Plateforme et Inscription
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">3.1 Conditions d'Accès</h3>
            <p className="text-slate-700">
              L'accès à la Plateforme est réservé aux personnes physiques majeures ayant la capacité juridique de contracter. L'Utilisateur garantit l'exactitude des informations fournies lors de l'inscription.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">3.2 Création de Compte</h3>
            <p className="text-slate-700">
              L'inscription nécessite la fourniture d'informations personnelles incluant :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Nom, prénom, adresse email</li>
              <li>Adresse postale complète</li>
              <li>Numéro de téléphone</li>
              <li>Date de naissance (vérification majorité)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">3.3 Sécurité du Compte</h3>
            <p className="text-slate-700">
              L'Utilisateur s'engage à conserver la confidentialité de ses identifiants et à signaler immédiatement toute utilisation non autorisée de son compte.
            </p>
          </div>
        </div>
      </section>
      
      {/* 4. Processus d'Investissement */}
      <section id="investissement" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          4. Processus d'Investissement
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">4.1 Sélection de Projet</h3>
            <p className="text-slate-700">
              L'Utilisateur choisit un projet parmi ceux proposés sur la Plateforme. Chaque projet présente des informations détaillées sur :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Le producteur et sa localisation</li>
              <li>Les objectifs environnementaux</li>
              <li>L'impact mesurable attendu</li>
              <li>Le calendrier de réalisation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">4.2 Paiement</h3>
            <p className="text-slate-700">
              Le paiement s'effectue par carte bancaire via notre prestataire sécurisé Stripe. Les moyens de paiement acceptés sont :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Cartes Visa, Mastercard, American Express</li>
              <li>Apple Pay et Google Pay</li>
              <li>Virements bancaires (sur demande)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">4.3 Confirmation</h3>
            <p className="text-slate-700">
              Après validation du paiement, l'Utilisateur reçoit :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Un email de confirmation avec reçu fiscal</li>
              <li>L'attribution immédiate des Points correspondants</li>
              <li>L'accès au suivi du projet investissement</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* 5. Système de Points */}
      <section id="points" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          5. Système de Points
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">5.1 Attribution</h3>
            <p className="text-slate-700">
              Les Points sont crédités immédiatement après validation du paiement selon la règle : 1€ investi = 0,8 Point attribué.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">5.2 Durée de Validité</h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <Clock className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Expiration des Points</h4>
                  <p className="text-red-700 text-sm">
                    Les Points expirent automatiquement 18 mois après leur attribution. Aucun remboursement ou prolongation n'est possible après expiration.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">5.3 Utilisation</h3>
            <p className="text-slate-700">
              Les Points peuvent uniquement être utilisés pour obtenir des Produits de nos Partenaires. Ils ne peuvent pas être :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Convertis en espèces</li>
              <li>Transférés à un autre Utilisateur</li>
              <li>Remboursés ou échangés</li>
              <li>Cumulés avec d'autres promotions (sauf mention contraire)</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* 6. Produits et Livraison */}
      <section id="produits" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          6. Produits et Livraison
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">6.1 Catalogue Produits</h3>
            <p className="text-slate-700">
              Les Produits proposés sont sélectionnés selon nos critères de durabilité et qualité. Le catalogue peut évoluer sans préavis.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">6.2 Commande</h3>
            <p className="text-slate-700">
              La commande est validée lorsque l'Utilisateur confirme sa sélection et que les Points sont débités. Un email de confirmation est envoyé.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">6.3 Livraison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">France Métropolitaine</h4>
                <p className="text-blue-700 text-sm">Livraison gratuite sous 5-7 jours ouvrés</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Europe</h4>
                <p className="text-green-700 text-sm">Livraison sous 10-15 jours ouvrés</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 7. Responsabilités */}
      <section id="responsabilites" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          7. Responsabilités et Limitations
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">7.1 Responsabilité de Make the CHANGE</h3>
            <p className="text-slate-700">
              Make the CHANGE s'engage à fournir ses services avec diligence mais ne peut garantir :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>La disponibilité continue de la Plateforme</li>
              <li>L'absence d'erreurs ou d'interruptions</li>
              <li>Les résultats précis des projets environnementaux</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">7.2 Limitations de Responsabilité</h3>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <p className="text-orange-700 text-sm">
                La responsabilité de Make the CHANGE est limitée au montant de l'Investissement effectué par l'Utilisateur. Sont exclus tous dommages indirects, pertes de profits ou préjudices immatériels.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 8. Droit de rétractation */}
      <section id="retractation" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          8. Droit de Rétractation
        </h2>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <Info className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800">Délai de Rétractation</h4>
              <p className="text-yellow-700 text-sm mb-2">
                Conformément à l'article L. 221-18 du Code de la consommation, l'Utilisateur dispose d'un délai de 14 jours calendaires pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p className="text-yellow-700 text-sm">
                Le délai court à compter de la confirmation de l'Investissement. Pour exercer ce droit, l'Utilisateur doit nous notifier sa décision par email à <a href="mailto:retractation@makethechange.fr" className="underline">retractation@makethechange.fr</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 9. Résiliation */}
      <section id="duree" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          9. Durée et Résiliation
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">9.1 Résiliation par l'Utilisateur</h3>
            <p className="text-slate-700">
              L'Utilisateur peut fermer son compte à tout moment en nous contactant. Les Points non utilisés seront perdus sans compensation.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">9.2 Résiliation par Make the CHANGE</h3>
            <p className="text-slate-700">
              Make the CHANGE peut suspendre ou résilier un compte en cas de :
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mt-2">
              <li>Non-respect des présentes CGU</li>
              <li>Utilisation frauduleuse de la Plateforme</li>
              <li>Informations fausses ou trompeuses</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* 10. Droit applicable */}
      <section id="litiges" className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          10. Droit Applicable et Litiges
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">10.1 Droit Applicable</h3>
            <p className="text-slate-700">
              Les présentes CGU sont régies par le droit français.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">10.2 Médiation</h3>
            <p className="text-slate-700">
              En cas de litige, l'Utilisateur peut recourir à la médiation de la consommation via la plateforme officielle : <a href="https://www.economie.gouv.fr/mediation-conso" className="text-blue-600 underline">economie.gouv.fr/mediation-conso</a>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">10.3 Juridiction</h3>
            <p className="text-slate-700">
              À défaut de résolution amiable, les tribunaux de Paris sont seuls compétents.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  </div>
  
  {/* Footer navigation */}
  <div className="bg-slate-50 py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-slate-600 mb-4 md:mb-0">
          Document mis à jour le 15 décembre 2024
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href="/legal/privacy">
              <Shield className="w-4 h-4 mr-2" />
              Politique de confidentialité
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/legal/terms-of-sale">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Conditions de vente
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 2. POLITIQUE DE CONFIDENTIALITÉ

### Structure Page Confidentialité

```jsx
<section id="privacy-policy">
  <h1 className="text-3xl font-bold text-slate-900 mb-8">
    Politique de Confidentialité et Protection des Données
  </h1>
  
  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
    <div className="flex">
      <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-blue-800 mb-2">Conformité RGPD</h3>
        <p className="text-blue-700 text-sm">
          Make the CHANGE s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés modifiée.
        </p>
      </div>
    </div>
  </div>
  
  {/* 1. Responsable de traitement */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      1. Responsable du Traitement
    </h2>
    
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="font-semibold text-slate-900">Société</dt>
          <dd className="text-slate-700">Make the CHANGE SAS</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Siège social</dt>
          <dd className="text-slate-700">123 Avenue des Champs-Élysées, 75008 Paris</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">SIRET</dt>
          <dd className="text-slate-700">123 456 789 00012</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">DPO</dt>
          <dd className="text-slate-700">
            <a href="mailto:dpo@makethechange.fr" className="text-blue-600 underline">
              dpo@makethechange.fr
            </a>
          </dd>
        </div>
      </dl>
    </div>
  </section>
  
  {/* 2. Données collectées */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      2. Données Personnelles Collectées
    </h2>
    
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">2.1 Données d'Inscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Données obligatoires</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Nom et prénom</li>
              <li>• Adresse email</li>
              <li>• Numéro de téléphone</li>
              <li>• Date de naissance</li>
              <li>• Adresse postale</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Données facultatives</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Préférences produits</li>
              <li>• Centres d'intérêt</li>
              <li>• Photo de profil</li>
              <li>• Données démographiques</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">2.2 Données de Paiement</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CreditCard className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Sécurité des Paiements</h4>
              <p className="text-green-700 text-sm mb-2">
                Les données bancaires sont traitées par notre prestataire Stripe (certifié PCI DSS Niveau 1). 
                Make the CHANGE ne stocke aucune donnée bancaire complète.
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Derniers chiffres de la carte (pour identification)</li>
                <li>• Historique des transactions</li>
                <li>• Statuts de paiement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">2.3 Données de Navigation</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-200 rounded-lg">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-900">Type de donnée</th>
                <th className="text-left p-3 font-semibold text-slate-900">Finalité</th>
                <th className="text-left p-3 font-semibold text-slate-900">Durée de conservation</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-700">Cookies techniques</td>
                <td className="p-3 text-slate-700">Fonctionnement du site</td>
                <td className="p-3 text-slate-700">Session</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-700">Cookies analytiques</td>
                <td className="p-3 text-slate-700">Amélioration de l'expérience</td>
                <td className="p-3 text-slate-700">13 mois</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-700">Adresse IP</td>
                <td className="p-3 text-slate-700">Sécurité, géolocalisation</td>
                <td className="p-3 text-slate-700">12 mois</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-3 text-slate-700">Logs de connexion</td>
                <td className="p-3 text-slate-700">Audit, sécurité</td>
                <td className="p-3 text-slate-700">12 mois</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  
  {/* 3. Finalités du traitement */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      3. Finalités du Traitement et Bases Légales
    </h2>
    
    <div className="space-y-4">
      {[
        {
          finalite: "Gestion des comptes utilisateurs",
          baseLegale: "Exécution du contrat",
          donnees: "Données d'inscription, authentification",
          duree: "Durée de la relation contractuelle + 3 ans"
        },
        {
          finalite: "Traitement des investissements",
          baseLegale: "Exécution du contrat",
          donnees: "Données de paiement, projets sélectionnés",
          duree: "10 ans (obligations comptables)"
        },
        {
          finalite: "Gestion des points et commandes",
          baseLegale: "Exécution du contrat",
          donnees: "Historique des points, commandes",
          duree: "Durée de validité des points + 3 ans"
        },
        {
          finalite: "Communication marketing",
          baseLegale: "Consentement",
          donnees: "Email, préférences",
          duree: "Jusqu'au retrait du consentement"
        },
        {
          finalite: "Amélioration des services",
          baseLegale: "Intérêt légitime",
          donnees: "Données d'usage, feedback",
          duree: "2 ans après collecte"
        },
        {
          finalite: "Respect des obligations légales",
          baseLegale: "Obligation légale",
          donnees: "Toutes données nécessaires",
          duree: "Selon obligations légales"
        }
      ].map((item, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Finalité</h4>
              <p className="text-slate-700 text-sm">{item.finalite}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Base légale</h4>
              <p className="text-slate-700 text-sm">{item.baseLegale}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Données concernées</h4>
              <p className="text-slate-700 text-sm">{item.donnees}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Durée de conservation</h4>
              <p className="text-slate-700 text-sm">{item.duree}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
  
  {/* 4. Vos droits */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      4. Vos Droits sur vos Données Personnelles
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          icon: Eye,
          title: "Droit d'accès",
          description: "Obtenir une copie de vos données personnelles",
          action: "Demander mes données"
        },
        {
          icon: Edit,
          title: "Droit de rectification",
          description: "Corriger des données inexactes ou incomplètes",
          action: "Modifier mes données"
        },
        {
          icon: Trash2,
          title: "Droit à l'effacement",
          description: "Supprimer vos données dans certaines conditions",
          action: "Supprimer mes données"
        },
        {
          icon: Pause,
          title: "Droit de limitation",
          description: "Limiter le traitement de vos données",
          action: "Limiter le traitement"
        },
        {
          icon: Download,
          title: "Droit à la portabilité",
          description: "Récupérer vos données dans un format lisible",
          action: "Exporter mes données"
        },
        {
          icon: X,
          title: "Droit d'opposition",
          description: "Vous opposer au traitement de vos données",
          action: "M'opposer au traitement"
        }
      ].map((right, index) => (
        <div key={index} className="bg-slate-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <right.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">{right.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{right.description}</p>
              <Button variant="outline" size="sm">
                {right.action}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-semibold text-blue-800 mb-3">Comment exercer vos droits ?</h3>
      <div className="space-y-2 text-blue-700 text-sm">
        <p>• Par email à : <a href="mailto:dpo@makethechange.fr" className="underline">dpo@makethechange.fr</a></p>
        <p>• Par courrier : Make the CHANGE - DPO, 123 Avenue des Champs-Élysées, 75008 Paris</p>
        <p>• Directement depuis votre espace personnel (section "Mes données")</p>
        <p className="mt-3 font-medium">Délai de réponse : 1 mois maximum (3 mois pour les demandes complexes)</p>
      </div>
    </div>
  </section>
  
  {/* 5. Sécurité */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      5. Sécurité et Protection des Données
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="font-semibold text-green-800 mb-2">Chiffrement</h3>
        <p className="text-green-700 text-sm">
          Toutes les données sont chiffrées en transit (SSL/TLS) et au repos (AES-256)
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <Server className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="font-semibold text-blue-800 mb-2">Hébergement</h3>
        <p className="text-blue-700 text-sm">
          Données hébergées en Europe (AWS Ireland) avec redondance et sauvegarde
        </p>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="font-semibold text-purple-800 mb-2">Accès</h3>
        <p className="text-purple-700 text-sm">
          Accès aux données limité aux personnes habilitées avec authentification forte
        </p>
      </div>
    </div>
  </section>
  
  {/* 6. Transferts */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      6. Transferts de Données
    </h2>
    
    <div className="space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Prestataires Externes</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Nous faisons appel à des prestataires tiers pour certains services. Tous sont liés par des accords de confidentialité stricts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-slate-900 text-sm mb-1">Stripe (Paiements)</h4>
            <p className="text-slate-600 text-xs">Irlande - Clauses contractuelles types</p>
          </div>
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-slate-900 text-sm mb-1">SendGrid (Emails)</h4>
            <p className="text-slate-600 text-xs">États-Unis - Privacy Shield</p>
          </div>
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-slate-900 text-sm mb-1">Google Analytics</h4>
            <p className="text-slate-600 text-xs">Anonymisation IP activée</p>
          </div>
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-slate-900 text-sm mb-1">Customer.io (CRM)</h4>
            <p className="text-slate-600 text-xs">États-Unis - Clauses contractuelles types</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  {/* 7. Contact DPO */}
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      7. Contact et Réclamations
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Délégué à la Protection des Données</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-slate-400 mr-3" />
            <a href="mailto:dpo@makethechange.fr" className="text-blue-600 underline">
              dpo@makethechange.fr
            </a>
          </div>
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-slate-400 mr-3 mt-0.5" />
            <div className="text-slate-700 text-sm">
              <p>Make the CHANGE - DPO</p>
              <p>123 Avenue des Champs-Élysées</p>
              <p>75008 Paris, France</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-red-50 rounded-lg p-6">
        <h3 className="font-semibold text-red-800 mb-4">Réclamation CNIL</h3>
        <p className="text-red-700 text-sm mb-3">
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL.
        </p>
        <div className="space-y-2 text-red-700 text-sm">
          <p>🌐 <a href="https://www.cnil.fr/fr/plaintes" className="underline">www.cnil.fr/fr/plaintes</a></p>
          <p>📞 01 53 73 22 22</p>
          <p>📮 CNIL, 3 Place de Fontenoy, 75007 Paris</p>
        </div>
      </div>
    </div>
  </section>
</section>
```

## 📊 Analytics & Tracking

### Gestion Cookies & Consentement

```typescript
// Cookie banner avec granularité
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activés
    analytics: false,
    marketing: false,
    functional: false
  });
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
      loadCookies(JSON.parse(consent));
    }
  }, []);
  
  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    loadCookies(allAccepted);
    setShowBanner(false);
  };
  
  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    loadCookies(preferences);
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 p-6 shadow-lg z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="mb-4 lg:mb-0 lg:mr-8">
            <h3 className="font-semibold text-slate-900 mb-2">
              Gestion des Cookies 🍪
            </h3>
            <p className="text-slate-600 text-sm max-w-2xl">
              Nous utilisons des cookies pour améliorer votre expérience. 
              Vous pouvez accepter tous les cookies ou personnaliser vos préférences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={() => setShowBanner(false)}>
              Nécessaires uniquement
            </Button>
            <Button variant="outline" onClick={() => setShowPreferences(true)}>
              Personnaliser
            </Button>
            <Button onClick={acceptAll}>
              Accepter tout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

**Stack Technique** : Vercel Edge Functions + Tailwind CSS + Framer Motion  
**Priorité** : 🔥 Critique - Conformité légale obligatoire  
**Estimation** : 3-4 jours rédaction + développement
