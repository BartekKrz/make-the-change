# KPIs & Métriques - Make the CHANGE

## 🎯 Framework Métriques 3-Phases

Les KPIs évoluent selon la phase de développement, chaque phase ayant ses métriques spécifiques de succès et ses gates de validation pour la transition suivante.

---

## 📊 **MRR (Monthly Recurring Revenue) Tracking**

### **Structure MRR Dual Model**
```yaml
MRR Components:
  Monthly Subscriptions:
    - Ambassadeur Standard: 18€/mois
    - Ambassadeur Premium: 32€/mois
    - Sous-total MRR Mensuel: (nb_users_std × 18) + (nb_users_prem × 32)
  
  Annual Subscriptions (MRR equivalent):
    - Ambassadeur Standard Annuel: 15€/mois équivalent (180€/12)
    - Ambassadeur Premium Annuel: 26,67€/mois équivalent (320€/12)
    - Sous-total MRR Annuel: (nb_users_std_ann × 15) + (nb_users_prem_ann × 26,67)
  
  Total MRR: MRR Mensuel + MRR Annuel équivalent
```

### **Métriques MRR par Billing Frequency**
```yaml
Monthly Subscribers:
  - MRR Growth Rate: Target 20%/mois
  - Churn Rate: <12% mensuel
  - Upgrade Rate: Monthly → Annual >20% après 6 mois
  - ARPU (Average Revenue Per User): 25€ target

Annual Subscribers:
  - ARR (Annual Recurring Revenue): Target 60% total subscribers
  - Churn Rate: <8% annuel
  - Retention Rate: >92% renouvellement
  - ARPU Annual: 250€ target
  
Conversion Metrics:
  - Monthly → Annual Conversion: >20% après 6 mois
  - Annual Discount Impact: 17% savings = main driver
  - Billing Mix Target: 60% Annual / 40% Monthly
```

### **Cohort Analysis par Billing Frequency**
```yaml
Monthly Cohort Tracking:
  - Month 1 Retention: >85%
  - Month 3 Retention: >70%
  - Month 6 Retention: >60%
  - Month 12 Retention: >50%
  - Lifetime Value: 300€ average

Annual Cohort Tracking:
  - Month 12 Retention: >92%
  - Month 24 Retention: >80%
  - Month 36 Retention: >70%
  - Lifetime Value: 500€ average
  
Upgrade Analysis:
  - Temps moyen Monthly → Annual: 4-6 mois
  - Trigger principal: Discount awareness (17%)
  - Seasonal Effect: +25% conversions en fin d'année
```

---

## 📊 PHASE 1 : Bootstrap Metrics (0€ - 5K€)

### **Business KPIs Phase 1**

#### **Revenue & Growth**
```yaml
Monthly Revenue:
  Mois 1-2: 1,000-2,500€ (lancement)
  Mois 3-4: 3,000-5,000€ (traction initiale)
  Mois 5-6: 6,000-10,000€ (croissance validée)
  Target fin Phase 1: 8,000€+ Revenu Mensuel

Revenue Breakdown:
  - Investments (Protecteurs): 60-70%
  - Subscriptions (Ambassadeurs): 20-30%
  - Commissions (Points): ~10%

Customer Acquisition:
  New Protecteurs: 15-25/mois
  New Ambassadeurs: 3-5/mois
  Total Active Customers: 80-120 fin Phase 1
  Organic Ratio: >70% (viralité du modèle d'investissement)
```

#### **Unit Economics Bootstrap - Modèle Hybride Dual Billing**
```yaml
CAC (Customer Acquisition Cost) par Niveau & Billing:
  Explorateur (Gratuit): 5€ (marketing + onboarding)
  Protecteur (Investissements): 15€ (conversion + support)
  Ambassadeur Monthly: 22€ (acquisition + onboarding)
  Ambassadeur Annual: 28€ (higher touch conversion process)
  
  Blended CAC Target: <20€ (optimisé modèle hybride dual)
  
LTV (Lifetime Value) par Niveau & Billing:
  Explorateur: 0€ direct (acquisition + engagement pour conversion)
  Protecteur: 150€ (2-3 investissements moyens sur 2 ans)
  Ambassadeur Monthly: 300€ (12 mois rétention moyenne, 25€/mois ARPU)
  Ambassadeur Annual: 500€ (24 mois rétention moyenne, discount loyalty)
  
  Blended LTV Target: >320€ (amélioration avec annual subscribers)

Ratios Modèle Hybride Dual:
  LTV/CAC Global: >16 (amélioration grâce annual subscribers)
  Payback Period Monthly: <8 mois
  Payback Period Annual: <6 mois (payment upfront)
  Funnel Conversion: Explorateur→Protecteur 30%, Protecteur→Ambassadeur 15%
  Monthly→Annual Upgrade: 20% après 6 mois
```

#### **Retention & Engagement par Billing Frequency**
```yaml
Ambassador Churn Rate Dual:
  Monthly Subscribers:
    - Monthly churn: <12% (higher due to commitment flexibility)
    - Quarterly churn: <25%
    - Annual churn: <60%
  
  Annual Subscribers:
    - Annual churn: <8% (lower due to upfront commitment)
    - Renewal Rate: >92%
    - Multi-year Retention: >80%

Billing Frequency Conversion:
  - Monthly → Annual Rate: >20% après 6 mois
  - Primary Driver: 17% discount awareness
  - Retention Post-Conversion: >95% annual renewal

Protector Re-investment Rate:
  - Target: >30% des Protecteurs ré-investissent dans les 12 mois
  - Subscription Upgrade: 15% Protecteur → Ambassadeur

Points Metrics:
  - Redemption rate: >70% (points utilisés pour des achats)
  - Average order value (points): 30-40 pts
  - Expiry rate: <10%

Customer Satisfaction par Billing:
  Monthly Subscribers: NPS >45 (flexibility valued)
  Annual Subscribers: NPS >55 (value recognition)
  Overall App rating: >4.5/5 
  Support satisfaction: >90%
```

### **Product & Operational KPIs**

#### **App Performance**
```yaml
Technical Metrics:
  App crashes: <0.5% sessions
  Loading time: <3s cold start
  API response: <1s P95
  Offline functionality: Basic (AsyncStorage)

User Engagement & Conversion Funnel Hybride:
  - Explorateur -> Protecteur Conversion: >30% (accès gratuit facilite conversion)
  - Protecteur -> Ambassadeur Conversion: >15% (parcours progressif naturel)
  - Explorateur -> Ambassadeur Direct: >5% (utilisateurs premium immédiat)
  - DAU/MAU par Niveau: Explorateur >15%, Protecteur >25%, Ambassadeur >35%
  - Sessions/month: Explorateur >5, Protecteur >12, Ambassadeur >20
  - Core action completion: >85% (modèle hybride plus engageant)
```

#### **Partner & Operations**
```yaml
Partner Performance:
  Active partners: 5-8 confirmed
  Fulfillment time: <48h average
  Quality complaints: <5% orders
  Partner satisfaction: >80% (survey)

Order Fulfillment:
  Order completion: >95% success rate
  Delivery time: 3-5 jours Europe
  Returns/exchanges: <8% orders
  Customer service: <4h response time
```

### **Transition Gates Phase 1 → Phase 2**

#### **Financial Validation Gates**
```yaml
✅ MRR Consistency: >5,000€ MRR pendant 3 mois consécutifs
✅ Growth Trajectory: >15%/mois growth rate sustained
✅ Unit Economics: LTV/CAC >5 démontré
✅ Cash Flow: Positive cash flow opérationnel
✅ Runway: 12+ mois de runway avec growth actuel
```

#### **Product-Market Fit Gates**
```yaml
✅ User Satisfaction: NPS >40, App rating >4.2
✅ Retention: Monthly churn <8%
✅ Engagement: Points redemption >65%
✅ Organic Growth: >60% acquisitions organiques
✅ Customer Success Stories: 10+ testimonials positifs
```

#### **Operational Readiness Gates**
```yaml
✅ Partner Network: 8+ partenaires actifs performants
✅ Catalog Depth: 25+ produits disponibles
✅ Fulfillment Excellence: <48h average, <5% complaints
✅ Team Capacity: Founders bandwidth OK pour scale
✅ Technology Stability: >99% uptime, <0.5% crash rate
```

---

## 🚀 PHASE 2 : Growth Metrics (5K€ - 50K€)

### **Business KPIs Phase 2**

#### **Scale Metrics**
```yaml
MRR Progression:
  Mois 7-12: 8,000-20,000€ MRR
  Mois 13-18: 25,000-50,000€ MRR
  Growth Rate: >25%/mois maintenu

Market Expansion:
  Geographic Markets: 3-5 pays (France, Belgique, Suisse)
  International Revenue: >25% total revenue
  Local Partnerships: 5+ partenaires par pays

Customer Segments:
  B2C Individual: 70% revenue
  B2B Corporate: 20% revenue  
  Premium Services: 10% revenue
```

#### **Advanced Unit Economics - Modèle Hybride Mature**
```yaml
Sophisticated CAC par Canal & Niveau:
  Organic channels (Social/Referral): <10€ CAC moyenne
  Paid social (Meta/Google): <25€ CAC moyenne  
  B2B/Corporate (Ambassadeur direct): <50€ CAC
  Blended average: <22€ CAC (optimisation continue modèle hybride)

Enhanced LTV Hybride:
  Upgrade Rate: Protecteur→Ambassadeur 25% annually
  Cross-sell success: 45% achats additionnels (points engagement)
  Corporate Ambassadeurs: 600€+ LTV average
  Blended LTV Phase 2: >420€ (maturation mix utilisateurs)

Profitability Metrics Hybrides:
  Gross Margin: >78% target (modèle asset-light optimisé)
  Contribution Margin: >65% target (économies échelle)
  EBITDA: >25% target (efficacité modèle hybride)
```

#### **Viral & Engagement KPIs (Phase 2)**
```yaml
Referral Program:
  - Referral Rate: % d'utilisateurs envoyant une invitation/mois (Target: >15%)
  - Referral Conversion Rate: % d'invités devenant Protecteur (Target: >20%)
  - K-Factor (Viral Coefficient): (Invitations * Conversion Rate) (Target: >0.3)

Social Sharing:
  - Sharing Rate: % d'utilisateurs partageant un impact/badge/mois (Target: >10%)
  - Clicks per Share: Nombre de clics générés par un partage (Target: >5)

Learn & Earn:
  - Content Engagement Rate: % d'utilisateurs complétant un quiz/avis (Target: >25%)
  - Points Earned via Engagement: Total de points générés hors investissement
```

### **Product & Team KPIs Phase 2**

#### **Technology Performance**
```yaml
Platform Metrics:
  Multi-platform: iOS + Android + Web
  API Performance: <200ms P95 response
  Uptime: >99.5% availability
  Data Processing: Real-time analytics

Team Performance:
  Team Size: 5-8 personnes
  Developer Productivity: Feature delivery velocity
  Employee Satisfaction: >4.2/5
  Retention Rate: >90% team retention
```

### **Transition Gates Phase 2 → Phase 3**

```yaml
✅ Scale Achievement: >30,000€ MRR sustained
✅ Market Leadership: Recognized brand leadership France
✅ International Success: 3+ countries profitable
✅ Team Excellence: Scalable leadership team
✅ Technology Platform: Enterprise-ready architecture
✅ Investment Readiness: Series A opportunity >500k€
```

---

## 💰 PHASE 3 : Scale Metrics (50K€ - 500K€)

### **Enterprise KPIs Phase 3**

#### **Market Leadership Metrics**
```yaml
Revenue Scale:
  MRR: 100,000-300,000€ target
  ARR: 1.2M-3.6M€ target
  Growth Rate: >40%/year sustained

Market Presence:
  European Markets: 8 pays actifs
  Market Share: Leadership position établi
  Brand Recognition: >25% awareness target market

Corporate Development:
  Team Size: 15-25 personnes
  Locations: Multi-country presence
  Strategic Partnerships: Major retailers/platforms
```

#### **Financial Excellence**
```yaml
Advanced Metrics:
  Rule of 40: Growth% + Profit% >40%
  Magic Number: Sales Efficiency >1.0
  Net Revenue Retention: >120%
  Gross Revenue Retention: >85%

Profitability:
  Gross Margin: >75%
  EBITDA Margin: >25%
  Free Cash Flow: >15% revenue
  Working Capital: Optimized negative cycle
```

### **Exit Preparation Metrics**

#### **Valuation Drivers**
```yaml
Financial Performance:
  ARR Growth: >50% year-over-year
  Predictable Revenue: >80% recurring
  Market Expansion: Multiple geography proof
  Unit Economics: Best-in-class margins

Strategic Assets:
  Technology Platform: Defensible IP
  Market Position: #1 or #2 position
  Team Quality: Experienced leadership
  Growth Options: Multiple expansion paths
```

---

## 📈 METRICS TRACKING & REPORTING

### **Dashboard Structure**

#### **Executive Dashboard (Daily)**
```yaml
North Star Metrics:
- MRR & Growth Rate
- Active Customers (Protecteurs + Ambassadeurs)
- Customer Satisfaction (NPS)
- Cash Runway

Critical Alerts:
- Churn spike (>20% increase)
- Revenue drop (>15% vs forecast)
- System downtime (>1h)
- Partner issues (fulfillment >48h)
```

#### **Business Intelligence (Weekly)**
```yaml
Growth Analysis:
- Cohort retention analysis
- Channel performance (CAC/LTV)
- Product adoption funnel
- Geographic expansion metrics

Operational Review:
- Partner performance scores
- Customer service metrics
- Technology performance
- Team productivity indicators
```

#### **Strategic Review (Monthly)**
```yaml
Strategic Metrics:
- Market position evolution
- Competitive landscape changes
- Team satisfaction & retention
- Strategic initiatives progress

Financial Deep-Dive:
- Unit economics evolution
- Profitability by segment
- Cash flow forecasting
- Investment readiness metrics
```

### **Reporting Automation**

#### **Tools & Integration**
```yaml
Analytics Stack:
- Product: Mixpanel (user behavior)
- Business: Custom PostgreSQL dashboards
- Financial: Stripe reporting + manual
- Operations: Google Sheets + automation

Automation Level:
- Phase 1: Manual + Google Sheets
- Phase 2: Semi-automated + BI tools
- Phase 3: Full automation + ML insights
```

#### **Alert System**
```yaml
Critical Alerts (Immediate):
- Revenue drops >20% vs trend
- Churn rate >15% monthly
- App crashes >1% sessions
- Partner fulfillment failures

Business Alerts (Daily):
- New subscriber targets missed
- CAC exceeding thresholds
- NPS dropping <40
- System performance issues

Strategic Alerts (Weekly):
- Market share changes
- Competitive threats
- Team capacity issues
- Investor KPI deviations
```

---

## 🎯 SUCCESS BENCHMARKS

### **Industry Benchmarks**

#### **SaaS/Subscription Metrics**
```yaml
Excellent Performance:
- Monthly Churn: <5%
- LTV/CAC: >3 (>5 ideal)
- NPS: >50
- Growth Rate: >20%/month early stage

Market Standards:
- App Store Rating: >4.0
- Support Response: <24h
- API Uptime: >99%
- Customer Satisfaction: >80%
```

#### **E-commerce Metrics**
```yaml
Best-in-Class:
- Conversion Rate: >3%
- Cart Abandonment: <70%
- Return Rate: <10%
- Repeat Purchase: >40%

Operational Excellence:
- Fulfillment Time: <48h
- Delivery Success: >95%
- Customer Service: <4h response
- Quality Complaints: <2%
```

### **Competitive Positioning**

#### **Market Leadership Indicators**
```yaml
Phase 1 Success:
- Top 3 player French market niche
- >60% organic acquisition (word-of-mouth)
- Customer advocacy evident (referrals)
- Press recognition emerging

Phase 2 Success:
- #1 or #2 position French market
- International expansion validated
- Strategic partnerships established
- Industry thought leadership

Phase 3 Success:
- European market leader
- Acquisition interest confirmed
- Platform network effects evident
- Multiple exit options available
```

**Ces métriques évolutives assurent une progression disciplinée et une validation objective à chaque phase de développement.**