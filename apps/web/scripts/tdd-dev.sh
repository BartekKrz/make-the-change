#!/bin/bash

# 🧪 Script de Développement TDD pour les Abonnements
# Ce script automatise le cycle TDD : Test → Code → Refactor

echo "🚀 Make the Change - TDD Development Script"
echo "==========================================="

# Configuration
TEST_FILE="test/e2e/admin-subscriptions.spec.ts"
APP_URL="http://localhost:3000"

# Fonction pour vérifier si le serveur est en marche
check_server() {
    curl -s $APP_URL > /dev/null
    return $?
}

# Fonction pour démarrer le serveur si nécessaire
start_server() {
    if ! check_server; then
        echo "🔄 Starting development server..."
        npm run dev &
        SERVER_PID=$!
        
        # Attendre que le serveur soit prêt
        while ! check_server; do
            echo "⏳ Waiting for server to start..."
            sleep 2
        done
        echo "✅ Development server is ready!"
    else
        echo "✅ Development server is already running"
    fi
}

# Fonction pour exécuter les tests
run_tests() {
    echo "🧪 Running TDD tests..."
    npx playwright test $TEST_FILE --headed --workers=1
    return $?
}

# Fonction pour générer des données de test
seed_data() {
    echo "🌱 Seeding test data..."
    node -e "
        const { TestDataSeeder, TestDataCleaner } = require('./test/e2e/helpers/test-data.ts');
        async function seed() {
            await TestDataCleaner.cleanupAll();
            const data = await TestDataSeeder.seedDataset();
            console.log('✅ Test data seeded:', data.users.length, 'users,', data.subscriptions.length, 'subscriptions');
        }
        seed().catch(console.error);
    "
}

# Fonction pour nettoyer les données de test
cleanup_data() {
    echo "🧹 Cleaning up test data..."
    node -e "
        const { TestDataCleaner } = require('./test/e2e/helpers/test-data.ts');
        TestDataCleaner.cleanupAll().then(() => console.log('✅ Test data cleaned'));
    "
}

# Fonction pour développement en mode watch
dev_watch() {
    echo "👀 Starting TDD watch mode..."
    echo "   - Tests will run automatically on file changes"
    echo "   - Press Ctrl+C to stop"
    
    # Installer nodemon si pas installé
    if ! command -v nodemon &> /dev/null; then
        echo "📦 Installing nodemon for watch mode..."
        npm install -g nodemon
    fi
    
    # Watch les fichiers et relancer les tests
    nodemon --watch "apps/web/src/app/admin/(dashboard)/subscriptions/" \
            --watch "packages/api/src/router/admin/subscriptions.ts" \
            --watch "test/e2e/" \
            --ext "ts,tsx" \
            --exec "npm run test:tdd"
}

# Menu principal
case "$1" in
    "setup")
        echo "🔧 Setting up TDD environment..."
        start_server
        seed_data
        echo "✅ TDD environment ready!"
        ;;
    "test")
        echo "🧪 Running TDD tests once..."
        start_server
        run_tests
        ;;
    "watch")
        echo "👀 Starting TDD watch mode..."
        start_server
        dev_watch
        ;;
    "seed")
        seed_data
        ;;
    "clean")
        cleanup_data
        ;;
    "reset")
        echo "🔄 Resetting TDD environment..."
        cleanup_data
        seed_data
        echo "✅ Environment reset complete!"
        ;;
    *)
        echo "Usage: $0 {setup|test|watch|seed|clean|reset}"
        echo ""
        echo "Commands:"
        echo "  setup  - Setup TDD environment (start server + seed data)"
        echo "  test   - Run tests once"
        echo "  watch  - Watch mode (auto-run tests on changes)"
        echo "  seed   - Generate and insert test data"
        echo "  clean  - Clean up test data"
        echo "  reset  - Clean and re-seed data"
        echo ""
        echo "Example TDD workflow:"
        echo "  1. $0 setup     # Setup environment"
        echo "  2. $0 watch     # Start watch mode"
        echo "  3. Edit code    # Tests run automatically"
        echo "  4. $0 clean     # Cleanup when done"
        exit 1
        ;;
esac
