# Communauté (V1)

## 🎯 Objectif

Créer un espace où les utilisateurs peuvent interagir, voir l'activité de la communauté et se sentir partie prenante d'un mouvement plus large. 

## 🎨 Design & Layout

### Écran Principal de la Communauté
```text
┌─────────────────────────┐
│ [←] Communauté         👥 │
│                         │
│ [Filtres: Tout, Mes Projets] │
│                         │
│ ┌─────────────────────┐ │
│ │ Sophie D. a soutenu │
│ │ le projet 🌳 Oliviers │
│ │ il y a 5 min.         │
│ │ [👍 12] [💬 3]        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ MILESTONE ATTEINT !   │ │
│ │ Le projet 🐝 Ruches a │
│ │ atteint 100% de son   │ │
│ │ financement !         │ │
│ │ [🎉 128] [💬 23]       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 📱 Composants UI

- **ActivityFeed** : Une liste d'événements (nouveaux investissements, milestones de projet, nouveaux badges obtenus).
- **ActivityCard** : Carte individuelle pour chaque événement, avec des actions sociales (Like, Commentaire).
- **Filtres** : Pour basculer entre le flux global et les nouvelles concernant uniquement les projets de l'utilisateur.

## 📡 API & Données

```typescript
// Obtenir le flux d'activité
GET /api/community/feed
Query: { filter: 'all' | 'my_projects', page: number }

// Interagir avec une activité
POST /api/community/feed/:id/react
{ reaction: 'like' | 'celebrate' }
```

## ✅ Critères de Validation
- Le flux se met à jour en temps réel (ou quasi).
- L'utilisateur peut filtrer pour ne voir que ce qui le concerne.
- Les interactions sociales sont simples et immédiates.