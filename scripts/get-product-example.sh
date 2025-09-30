#!/bin/bash

# Script pour récupérer tous les champs d'un produit depuis Supabase
# Utilise curl pour faire des requêtes HTTP directes

echo "🚀 Récupération des champs produit depuis Supabase"
echo "=================================================="

# Configuration (à adapter selon votre environnement)
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"

# Couleurs pour la sortie
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour faire une requête SQL
query_supabase() {
    local sql="$1"

    echo -e "${BLUE}🔍 Exécution de la requête SQL...${NC}"
    echo "SQL: $sql"
    echo

    # Ici vous pouvez utiliser curl pour faire la requête
    # curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
    #      -H "Content-Type: application/json" \
    #      -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    #      -H "apikey: $SUPABASE_ANON_KEY" \
    #      -d "{\"query\": \"$sql\"}"
}

# Requête pour récupérer tous les champs d'un produit
get_product_fields() {
    local product_id="$1"

    if [ -z "$product_id" ]; then
        echo -e "${YELLOW}⚠️ ID du produit non fourni, récupération des 5 premiers produits...${NC}"
        SQL="
        SELECT
          id,
          name,
          slug,
          short_description,
          description,
          category_id,
          producer_id,
          price_points,
          price_eur_equivalent,
          fulfillment_method,
          is_hero_product,
          stock_quantity,
          stock_management,
          weight_grams,
          dimensions,
          images,
          tags,
          variants,
          nutrition_facts,
          allergens,
          certifications,
          origin_country,
          seasonal_availability,
          min_tier,
          featured,
          is_active,
          launch_date,
          discontinue_date,
          seo_title,
          seo_description,
          metadata,
          created_at,
          updated_at,
          blur_hashes,
          secondary_category_id,
          partner_source
        FROM products
        ORDER BY created_at DESC
        LIMIT 5
        "
    else
        echo -e "${GREEN}🔍 Récupération du produit avec ID: $product_id${NC}"
        SQL="
        SELECT
          id,
          name,
          slug,
          short_description,
          description,
          category_id,
          producer_id,
          price_points,
          price_eur_equivalent,
          fulfillment_method,
          is_hero_product,
          stock_quantity,
          stock_management,
          weight_grams,
          dimensions,
          images,
          tags,
          variants,
          nutrition_facts,
          allergens,
          certifications,
          origin_country,
          seasonal_availability,
          min_tier,
          featured,
          is_active,
          launch_date,
          discontinue_date,
          seo_title,
          seo_description,
          metadata,
          created_at,
          updated_at,
          blur_hashes,
          secondary_category_id,
          partner_source
        FROM products
        WHERE id = '$product_id'
        "
    fi

    echo -e "${BLUE}📋 Structure des champs récupérés:${NC}"
    echo "1. id (UUID PRIMARY KEY)"
    echo "2. name (VARCHAR)"
    echo "3. slug (VARCHAR UNIQUE)"
    echo "4. short_description (TEXT)"
    echo "5. description (TEXT)"
    echo "6. category_id (UUID REFERENCES categories)"
    echo "7. producer_id (UUID REFERENCES producers)"
    echo "8. price_points (INTEGER)"
    echo "9. price_eur_equivalent (DECIMAL)"
    echo "10. fulfillment_method (VARCHAR: stock/dropship)"
    echo "11. is_hero_product (BOOLEAN)"
    echo "12. stock_quantity (INTEGER)"
    echo "13. stock_management (BOOLEAN)"
    echo "14. weight_grams (INTEGER)"
    echo "15. dimensions (JSONB)"
    echo "16. images (TEXT[])"
    echo "17. tags (TEXT[])"
    echo "18. variants (JSONB)"
    echo "19. nutrition_facts (JSONB)"
    echo "20. allergens (TEXT[])"
    echo "21. certifications (TEXT[])"
    echo "22. origin_country (VARCHAR)"
    echo "23. seasonal_availability (JSONB)"
    echo "24. min_tier (VARCHAR: explorateur/protecteur/ambassadeur)"
    echo "25. featured (BOOLEAN)"
    echo "26. is_active (BOOLEAN)"
    echo "27. launch_date (DATE)"
    echo "28. discontinue_date (DATE)"
    echo "29. seo_title (VARCHAR)"
    echo "30. seo_description (TEXT)"
    echo "31. metadata (JSONB)"
    echo "32. created_at (TIMESTAMP)"
    echo "33. updated_at (TIMESTAMP)"
    echo "34. blur_hashes (TEXT[])"
    echo "35. secondary_category_id (UUID)"
    echo "36. partner_source (VARCHAR)"
    echo
    echo -e "${YELLOW}📊 Total: 36 champs${NC}"
    echo

    # Afficher la requête SQL
    echo -e "${GREEN}✅ Requête SQL générée:${NC}"
    echo "$SQL"
    echo

    echo -e "${BLUE}💡 Pour exécuter cette requête:${NC}"
    echo "1. Ouvrez Supabase Dashboard"
    echo "2. Allez dans SQL Editor"
    echo "3. Copiez-collez la requête ci-dessus"
    echo "4. Cliquez sur 'Run'"
    echo

    echo -e "${BLUE}💡 Ou utilisez l'API REST:${NC}"
    echo "curl -X POST \"$SUPABASE_URL/rest/v1/rpc/execute_sql\" \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -H \"Authorization: Bearer $SUPABASE_ANON_KEY\" \\"
    echo "     -H \"apikey: $SUPABASE_ANON_KEY\" \\"
    echo "     -d '{\"query\": \"$SQL\"}'"
}

# Fonction pour récupérer un produit avec ses relations
get_product_with_relations() {
    local product_id="$1"

    if [ -z "$product_id" ]; then
        echo -e "${RED}❌ ID du produit requis pour cette fonction${NC}"
        exit 1
    fi

    echo -e "${GREEN}🔗 Récupération du produit avec relations: $product_id${NC}"

    SQL="
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      pr.name as producer_name,
      pr.slug as producer_slug,
      pr.type as producer_type,
      sc.name as secondary_category_name,
      sc.slug as secondary_category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN categories sc ON p.secondary_category_id = sc.id
    LEFT JOIN producers pr ON p.producer_id = pr.id
    WHERE p.id = '$product_id'
    "

    echo -e "${BLUE}📋 Champs supplémentaires avec relations:${NC}"
    echo "• category_name"
    echo "• category_slug"
    echo "• producer_name"
    echo "• producer_slug"
    echo "• producer_type"
    echo "• secondary_category_name"
    echo "• secondary_category_slug"
    echo

    echo -e "${GREEN}✅ Requête SQL générée:${NC}"
    echo "$SQL"
}

# Fonction principale
main() {
    case "$1" in
        "get")
            get_product_fields "$2"
            ;;
        "relations")
            get_product_with_relations "$2"
            ;;
        "help"|*)
            echo -e "${GREEN}📖 Utilisation:${NC}"
            echo "  ./get-product-example.sh get [product_id]     # Récupère un produit ou les 5 premiers"
            echo "  ./get-product-example.sh relations <product_id> # Récupère un produit avec ses relations"
            echo
            echo -e "${YELLOW}📝 Exemples:${NC}"
            echo "  ./get-product-example.sh get"
            echo "  ./get-product-example.sh get 123e4567-e89b-12d3-a456-426614174000"
            echo "  ./get-product-example.sh relations 123e4567-e89b-12d3-a456-426614174000"
            echo
            echo -e "${BLUE}🔧 Configuration:${NC}"
            echo "  Modifiez les variables SUPABASE_URL et SUPABASE_ANON_KEY dans ce script"
            ;;
    esac
}

# Exécution
main "$@"







