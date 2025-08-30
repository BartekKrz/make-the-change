# 🛒 Catalogue Produits - Grille Tarifaire Définitive

## 🎯 Contexte Mis à Jour

**CHANGEMENT MAJEUR** : Implémentation de la **grille tarifaire définitive** selon `pricing-master-sheet.md` avec prix **obligatoires et non-modifiables**.

## 📊 Catalogue Produits Finalisé

### HABEEBEE - Produits Apicoles (Commission 20%)
- Miel d'Acacia 250g : **15 points** (€15 valeur)
- Miel d'Acacia 500g : **27 points** (€27 valeur)
- Miel de Tilleul 500g : **30 points** (€30 valeur)
- Pollen frais 100g : **13 points** (€13 valeur)

### ILANGA NATURE - Madagascar (Commission 25%)
- Pink Berries Honey BIO 250g : **9 points** (€9 valeur)
- Vanille 3 gousses : **13 points** (€13 valeur)
- Voatsiperifery rouge 150g : **30 points** (€30 valeur)

### Coffrets Make the CHANGE
- Coffret Découverte Miels : **35 points** (€35 valeur)
- Collection Épices Premium : **45 points** (€45 valeur)

## 🔧 Requirements Développement

### Interface Catalogue
- [ ] Affichage prix en points selon grille définitive
- [ ] Calcul automatique commissions partenaires (20%/25%)
- [ ] Système d'économies vs prix public affiché
- [ ] Gestion stock avec alertes partenaires

### Business Logic
- [ ] Prix **non-modifiables** en frontend (hard-coded)
- [ ] Validation grille tarifaire obligatoire
- [ ] Audit trail pour tentatives modification prix
- [ ] Commission tracking précis par partenaire

## ✅ Critères d'Acceptation

- ✅ Grille tarifaire définitive implémentée (100% conforme)
- ✅ Prix en points affichés selon pricing-master-sheet.md
- ✅ Commissions partenaires automatiques (20%/25%)
- ✅ Aucune modification prix possible sans validation business
