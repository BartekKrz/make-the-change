'use client';

import { useState } from 'react';
import { AdminPageLayout } from '../components/admin-layout';
import { ProductFilterModal } from './components/product-filter-modal';
import { type ViewMode } from '../components/ui/view-toggle';

// Types spécifiques à cette page
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
};

type Producer = {
  id: string;
  name: string;
};

// Données mockées pour l'exemple
const mockProducts: Product[] = [
  { id: '1', name: 'Produit 1', description: 'Description du produit 1', price: 29.99, active: true },
  { id: '2', name: 'Produit 2', description: 'Description du produit 2', price: 39.99, active: false },
  { id: '3', name: 'Produit 3', description: 'Description du produit 3', price: 19.99, active: true },
];

const mockProducers: Producer[] = [
  { id: '1', name: 'Producteur 1' },
  { id: '2', name: 'Producteur 2' },
];

export default function ProductsPage() {
  // État local simple
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();
  const [activeOnly, setActiveOnly] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filtrage simple des produits
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = !activeOnly || product.active;
    return matchesSearch && matchesActive;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedProducerId(undefined);
    setActiveOnly(false);
  };

  return (
    <AdminPageLayout
      view={view}
      onViewChange={setView}
      search={search}
      onSearchChange={setSearch}
      isLoading={false}
    >
      <AdminPageLayout.Header
        searchPlaceholder="Rechercher des produits..."
        createButton={{ href: '/admin/products/new', label: 'Nouveau produit' }}
        mobileFilters={
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Filtres
          </button>
        }
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </span>
        </div>
      </AdminPageLayout.Header>

      <AdminPageLayout.Content>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-2'
          }>
            {filteredProducts.map((product) => 
              view === 'grid' ? (
                <div key={product.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  )}
                  <p className="font-semibold text-lg text-gray-900">{product.price.toFixed(2)} €</p>
                </div>
              ) : (
                <div key={product.id} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg text-gray-900">{product.price.toFixed(2)} €</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </AdminPageLayout.Content>

      {/* Modal de filtres */}
      <ProductFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        producers={mockProducers}
        selectedProducerId={selectedProducerId}
        setSelectedProducerId={setSelectedProducerId}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        view={view}
        setView={setView}
      />
    </AdminPageLayout>
  );
}
