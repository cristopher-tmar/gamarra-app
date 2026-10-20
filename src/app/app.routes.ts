import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './layouts/public-layout/public-layout.component'
      ).then(
        (module) =>
          module.PublicLayoutComponent,
      ),
    children: [
      {
        path: 'catalogo',
        loadComponent: () =>
          import(
            './features/catalog/pages/catalog/catalog.page'
          ).then(
            (module) =>
              module.CatalogPage,
          ),
      },
      {
        path: 'catalogo/:productoId',
        loadComponent: () =>
          import(
            './features/catalog/pages/product-detail/product-detail.page'
          ).then(
            (module) =>
              module.ProductDetailPage,
          ),
      },
      {
        path: 'busqueda-visual',
        loadComponent: () =>
          import(
            './features/visual-search/pages/visual-search/visual-search.page'
          ).then(
            (module) =>
              module.VisualSearchPage,
          ),
      },
      {
        path: 'busqueda-visual/resultados',
        loadComponent: () =>
          import(
            './features/visual-search/pages/visual-search-results/visual-search-results.page'
          ).then(
            (module) =>
              module.VisualSearchResultsPage,
          ),
      },
      {
        path: 'favoritos',
        loadComponent: () =>
          import(
            './features/favorites/pages/favorites/favorites.page'
          ).then(
            (module) =>
              module.FavoritesPage,
          ),
      },
      {
        path: 'mi-cuenta',
        loadComponent: () =>
          import(
            './features/account/pages/account/account.page'
          ).then(
            (module) =>
              module.AccountPage,
          ),
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
];