# 🎯 Partage d'Impact Social (V1)

**📍 VERSION: V1** | **🗓️ TIMELINE: Mois 7** | **⭐️ PRIORITÉ: P1 (Important)**

## 🎯 Objectif

Transformer les actions des utilisateurs en "Social Proof" puissant. Le but est de leur donner des outils pour partager leur engagement de manière esthétique et inspirante, générant ainsi de la notoriété et de la croissance organique pour la plateforme.

## 📋 Mécanisme de Partage

L'application doit permettre de partager facilement des jalons et réussites sous forme de "cartes de partage" visuelles et dynamiques, optimisées pour les réseaux sociaux (Instagram Stories, LinkedIn, etc.).

### Contenus Partageables

1.  **Rapport d'Impact Personnel**
    - **Trigger** : Accessible à tout moment depuis le dashboard, ou via une notification mensuelle/annuelle.
    - **Contenu** : Une infographie animée et personnalisée : "En 2025, grâce à Make the CHANGE, j'ai contribué à : ..."
        - 🌳 X arbres plantés
        - 🐝 Y abeilles protégées
        - 🌍 Z kg de CO2 compensés
    - **CTA** : Inclut le lien de parrainage de l'utilisateur.

2.  **Badge de Gamification Débloqué**
    - **Trigger** : Immédiatement après avoir débloqué un badge (ex: "Protecteur des Abeilles").
    - **Contenu** : Une carte visuelle avec le design du badge, le nom de l'utilisateur, et la description du succès.

3.  **Soutien à un Nouveau Projet**
    - **Trigger** : Sur l'écran de confirmation après un investissement.
    - **Contenu** : "Je viens de soutenir le projet [Nom du Projet] ! Rejoignez-moi pour aider [Nom du Producteur] à ..."

### Récompenses de Partage

- **Récompense d'Action** : **+5 points** pour chaque partage effectué (limité à 1 par semaine pour éviter le spam).
- **Récompense de Conversion** : **+25 points** si un nouvel utilisateur s'inscrit ET investit via le lien partagé.

## 🖼️ Interface Utilisateur

- **Boutons de Partage** : Intégrés de manière contextuelle (sur la page d'un badge, sur le rapport d'impact, etc.).
- **Prévisualisation** : L'utilisateur voit un aperçu de la carte de partage avant de la publier.
- **Partage Natif** : Utilise les fonctionnalités de partage natives d'iOS et Android pour un maximum de fluidité.

## 🔧 Implémentation Technique

- **Génération d'Images/Vidéos** : Un service côté serveur (ou une librairie client comme `react-native-view-shot`) génère les visuels de partage à la volée avec les données de l'utilisateur.
- **Liens Uniques** : Chaque partage intègre le code de parrainage de l'utilisateur pour tracker les conversions.

## 📊 KPIs de Succès
- **Taux de Partage** : % d'utilisateurs qui partagent au moins une fois par mois.
- **Taux de Clics sur Liens Partagés**.
- **Taux de Conversion via Partages** : % de nouveaux utilisateurs inscrits via un lien partagé.
