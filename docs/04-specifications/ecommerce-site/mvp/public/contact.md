# Contact & Support - Site E-commerce

## 🎯 Objectif

Faciliter la communication avec les utilisateurs et prospects, offrir un support multicanal efficace et rassurer sur la proximité de l'équipe Make the CHANGE.

## 👤 Utilisateurs Cibles

- **Prospects** : Questions pré-investissement
- **Utilisateurs existants** : Support technique et commercial
- **Partenaires potentiels** : Demandes de partenariat
- **Journalistes/Investisseurs** : Demandes d'information

## 🎨 Design & Layout

### Structure de Page

```text
[Header Global]
├── Hero Section
├── Section Moyens de Contact
├── Section FAQ Rapide
├── Section Formulaire Contact
├── Section Équipe
├── Section Localisation
└── [Footer Global]
```

### Hero Section

```jsx
<div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Nous Sommes Là pour Vous
    </h1>
    <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
      Une question ? Un doute ? Notre équipe est disponible pour vous accompagner 
      dans votre démarche d'investissement responsable.
    </p>
    
    <div className="flex justify-center space-x-4">
      <Button size="lg" variant="secondary" onClick={() => scrollToSection('contact-form')}>
        <MessageSquare className="w-5 h-5 mr-2" />
        Nous contacter
      </Button>
      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
        <Link href="/comment-ca-marche">
          <HelpCircle className="w-5 h-5 mr-2" />
          Comment ça marche ?
        </Link>
      </Button>
    </div>
  </div>
</div>
```

### Moyens de Contact

```jsx
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        Plusieurs Façons de Nous Joindre
      </h2>
      <p className="text-lg text-slate-600">
        Choisissez le canal qui vous convient le mieux
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Chat en ligne */}
      <div className="text-center group">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
          <MessageCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Chat en Direct
        </h3>
        <p className="text-slate-600 mb-4 text-sm">
          Réponse immédiate à vos questions
        </p>
        <Button variant="outline" size="sm" className="group-hover:bg-blue-50">
          <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Ouvrir le chat
        </Button>
        <p className="text-xs text-slate-500 mt-2">
          Lun-Ven 9h-18h
        </p>
      </div>
      
      {/* Email */}
      <div className="text-center group">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
          <Mail className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Email
        </h3>
        <p className="text-slate-600 mb-4 text-sm">
          Pour questions détaillées
        </p>
        <Button variant="outline" size="sm" asChild className="group-hover:bg-green-50">
          <a href="mailto:contact@makethechange.fr">
            contact@makethechange.fr
          </a>
        </Button>
        <p className="text-xs text-slate-500 mt-2">
          Réponse sous 4h
        </p>
      </div>
      
      {/* Téléphone */}
      <div className="text-center group">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
          <Phone className="w-10 h-10 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Téléphone
        </h3>
        <p className="text-slate-600 mb-4 text-sm">
          Conseil personnalisé
        </p>
        <Button variant="outline" size="sm" asChild className="group-hover:bg-yellow-50">
          <a href="tel:+33155667788">
            01 55 66 77 88
          </a>
        </Button>
        <p className="text-xs text-slate-500 mt-2">
          Rappel gratuit
        </p>
      </div>
      
      {/* Rendez-vous */}
      <div className="text-center group">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
          <Calendar className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Rendez-vous
        </h3>
        <p className="text-slate-600 mb-4 text-sm">
          Présentation sur-mesure
        </p>
        <Button variant="outline" size="sm" className="group-hover:bg-purple-50">
          Réserver un créneau
        </Button>
        <p className="text-xs text-slate-500 mt-2">
          30min • Gratuit
        </p>
      </div>
    </div>
    
    {/* Support urgence */}
    <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Problème Urgent ?
      </h3>
      <p className="text-red-700 mb-4">
        Pour les problèmes techniques critiques ou les urgences de paiement
      </p>
      <Button variant="destructive" size="sm" asChild>
        <a href="mailto:urgence@makethechange.fr">
          <Zap className="w-4 h-4 mr-2" />
          Contact Urgence
        </a>
      </Button>
    </div>
  </div>
</section>
```

### FAQ Rapide

```jsx
<section className="py-16 bg-slate-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        Réponses Instantanées
      </h2>
      <p className="text-lg text-slate-600">
        Les questions les plus fréquentes
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* FAQ Cards */}
      {[
        {
          icon: Clock,
          question: "Délai de livraison",
          answer: "5-7 jours ouvrés pour la France métropolitaine",
          color: "blue"
        },
        {
          icon: CreditCard,
          question: "Moyens de paiement",
          answer: "CB, Paypal, virement, Apple Pay, Google Pay",
          color: "green"
        },
        {
          icon: Shield,
          question: "Sécurité des données",
          answer: "Cryptage SSL, conformité RGPD, données en France",
          color: "purple"
        },
        {
          icon: RefreshCw,
          question: "Retours produits",
          answer: "Politique de satisfaction 30 jours",
          color: "yellow"
        },
        {
          icon: Globe,
          question: "Livraison internationale",
          answer: "Europe disponible, autres zones sur demande",
          color: "indigo"
        },
        {
          icon: Users,
          question: "Compte entreprise",
          answer: "Offres spéciales B2B et CSE disponibles",
          color: "rose"
        }
      ].map((faq, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 bg-${faq.color}-100 rounded-lg flex items-center justify-center mb-4`}>
            <faq.icon className={`w-6 h-6 text-${faq.color}-600`} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {faq.question}
          </h3>
          <p className="text-slate-600 text-sm">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
    
    <div className="text-center mt-8">
      <Button variant="outline" asChild>
        <Link href="/faq">
          <BookOpen className="w-4 h-4 mr-2" />
          Voir toutes les FAQ
        </Link>
      </Button>
    </div>
  </div>
</section>
```

### Formulaire Contact

```jsx
<section id="contact-form" className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Envoyez-nous un Message
        </h2>
        <p className="text-lg text-slate-600">
          Décrivez votre situation, nous vous répondrons personnellement
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulaire */}
        <div className="bg-slate-50 rounded-2xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Type de demande */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de demande</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="question">Question générale</SelectItem>
                        <SelectItem value="support">Support technique</SelectItem>
                        <SelectItem value="partenariat">Partenariat</SelectItem>
                        <SelectItem value="presse">Demande presse</SelectItem>
                        <SelectItem value="investisseur">Relation investisseur</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+33 1 23 45 67 89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Sujet */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sujet</FormLabel>
                    <FormControl>
                      <Input placeholder="Résumé de votre demande" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre question ou demande en détail..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pièce jointe */}
              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pièce jointe (optionnel)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 mb-2">
                          Glissez un fichier ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-slate-500">
                          PDF, JPG, PNG jusqu'à 10MB
                        </p>
                        <Input type="file" className="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Consentement */}
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        J'accepte que mes données soient utilisées pour traiter ma demande*
                      </FormLabel>
                      <p className="text-xs text-slate-500">
                        Conformément au RGPD. <Link href="/privacy" className="underline">Politique de confidentialité</Link>
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Informations complémentaires */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Temps de Réponse
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span className="text-slate-700">Questions générales : <strong>4h</strong></span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-slate-700">Support technique : <strong>24h</strong></span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-slate-700">Partenariats : <strong>48h</strong></span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Informations Utiles
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Numéro de commande si support produit
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Captures d'écran pour problèmes techniques
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Détails du projet pour partenariats
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Coordonnées complètes d'entreprise
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start">
              <Lightbulb className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Conseil Pro
                </h4>
                <p className="text-blue-700 text-sm">
                  Plus vous nous donnez de contexte, plus notre réponse sera précise et utile. 
                  N'hésitez pas à détailler votre situation !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Section Équipe

```jsx
<section className="py-16 bg-slate-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        L'Équipe à Votre Écoute
      </h2>
      <p className="text-lg text-slate-600">
        Des experts passionnés au service de votre projet
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {/* Support Client */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Headphones className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Support Client
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Marie, Sophie et Thomas vous accompagnent dans toutes vos démarches
        </p>
        <div className="text-xs text-slate-500">
          <p>Lun-Ven 9h-18h</p>
          <p>Sam 9h-12h</p>
        </div>
      </div>
      
      {/* Conseil Investissement */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Conseil Investissement
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Jean-Paul et Camille vous guident dans le choix de vos projets
        </p>
        <div className="text-xs text-slate-500">
          <p>Sur RDV</p>
          <p>Gratuit</p>
        </div>
      </div>
      
      {/* Relations Partenaires */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Handshake className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Relations Partenaires
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Alice développe notre réseau de producteurs et partenaires
        </p>
        <div className="text-xs text-slate-500">
          <p>Lun-Ven 9h-17h</p>
          <p>Sur projet</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Localisation

```jsx
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        Nos Bureaux
      </h2>
      <p className="text-lg text-slate-600">
        Basés au cœur de Paris, proches de nos partenaires
      </p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Informations */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Make the CHANGE
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-700">123 Avenue des Champs-Élysées</p>
                <p className="text-slate-700">75008 Paris, France</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <a href="tel:+33155667788" className="text-slate-700 hover:text-blue-600">
                +33 1 55 66 77 88
              </a>
            </div>
            
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <a href="mailto:contact@makethechange.fr" className="text-slate-700 hover:text-blue-600">
                contact@makethechange.fr
              </a>
            </div>
          </div>
        </div>
        
        {/* Horaires */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">
            Horaires d'ouverture
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Lundi - Vendredi</span>
              <span className="text-slate-900">9h00 - 18h00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Samedi</span>
              <span className="text-slate-900">9h00 - 12h00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Dimanche</span>
              <span className="text-slate-500">Fermé</span>
            </div>
          </div>
        </div>
        
        {/* Accès */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">
            Comment nous rejoindre
          </h4>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center">
              <Train className="w-4 h-4 mr-2" />
              <span>Métro 1, 9 - George V (2 min)</span>
            </div>
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2" />
              <span>Parking Champs-Élysées (100m)</span>
            </div>
            <div className="flex items-center">
              <Plane className="w-4 h-4 mr-2" />
              <span>CDG 45min, Orly 35min</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Carte */}
      <div className="bg-slate-100 rounded-2xl overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991897108063!2d2.30147!3d48.87007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fde8e5a3b7b%3A0x6a42eb7b4e6c9c23!2sChamps-%C3%89lys%C3%A9es%2C%20Paris%2C%20France!5e0!3m2!1sfr!2sfr!4v1647887654321!5m2!1sfr!2sfr"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  </div>
</section>
```

## 🚀 API & Data

### Contact Form API

```typescript
// /api/contact/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation
    const contactData = contactSchema.parse(body);
    
    // Sauvegarder en DB
    const contact = await db.contact.create({
      data: {
        type: contactData.type,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message,
        attachment: contactData.attachment,
        status: 'PENDING',
        priority: getPriority(contactData.type),
        assignedTo: getAssignee(contactData.type)
      }
    });
    
    // Notifications
    await Promise.all([
      sendConfirmationEmail(contactData.email, contact.id),
      sendInternalNotification(contact),
      updateSlackChannel(contact)
    ]);
    
    return NextResponse.json({
      success: true,
      contactId: contact.id,
      estimatedResponse: getEstimatedResponse(contactData.type)
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
```

### Support Chat Integration

```typescript
// Integration avec Crisp ou Intercom
const ChatWidget = () => {
  useEffect(() => {
    // Configuration Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_ID;
    
    // Personnalisation
    $crisp.push(['set', 'user:email', user?.email]);
    $crisp.push(['set', 'user:nickname', user?.name]);
    $crisp.push(['set', 'session:data', [{
      investments: user?.investments?.length || 0,
      totalInvested: user?.totalInvested || 0,
      memberSince: user?.createdAt
    }]]);
    
  }, [user]);
  
  return null;
};
```

## 📱 Responsive & Accessibility

### Mobile Optimizations

```jsx
// Formulaire adaptatif mobile
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Champs côte à côte sur desktop, empilés sur mobile */}
</div>

// CTA mobile sticky
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden">
  <Button className="w-full" onClick={scrollToForm}>
    <MessageSquare className="w-4 h-4 mr-2" />
    Nous contacter
  </Button>
</div>
```

### Accessibility Features

```jsx
// Navigation par clavier
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openChatWidget();
    }
  }}
  aria-label="Ouvrir le chat en direct"
/>

// Screen readers
<div role="main" aria-labelledby="contact-title">
  <h1 id="contact-title">Contact et Support</h1>
</div>
```

## 📊 Analytics & Tracking

### Contact Funnel Tracking

```typescript
// Google Analytics 4 events
gtag('event', 'contact_form_started', {
  contact_type: formData.type,
  page_location: window.location.href
});

gtag('event', 'contact_form_completed', {
  contact_type: formData.type,
  estimated_response: responseTime
});

// HotJar heatmaps
hj('event', 'contact_form_interaction');
```

---

**Stack Technique** : Next.js 15.5 (App Router) sur Vercel + React Hook Form + shadcn/ui + Crisp Chat  
**Priorité** : 🔥 Critique - Support client essentiel  
**Estimation** : 4-5 jours développement + intégrations
