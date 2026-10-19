import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component')
        .then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./features/catalog/pages/catalog/catalog.page')
            .then((m) => m.CatalogPage),
      },
      {
        path: 'catalogo/:productoId',
        loadComponent: () =>
          import('./features/catalog/pages/product-detail/product-detail.page')
            .then((m) => m.ProductDetailPage),
      },
      {
        path: 'busqueda-visual',
        loadComponent: () =>
          import('./features/visual-search/pages/visual-search/visual-search.page')
            .then((m) => m.VisualSearchPage),
      },
      {
        path: 'busqueda-visual/resultados',
        loadComponent: () =>
          import('./features/visual-search/pages/visual-search-results/visual-search-results.page')
            .then((m) => m.VisualSearchResultsPage),
      },
      {
        path: '',
        redirectTo: 'catalogo',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'catalogo',
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/pages/favorites/favorites.page').then( m => m.FavoritesPage)
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/pages/account/account.page').then( m => m.AccountPage)
  },
];