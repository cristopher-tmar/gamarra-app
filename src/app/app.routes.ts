import {
  Routes,
} from '@angular/router';

import {
  authGuard,
} from './features/auth/guards/auth.guard';
import {
  roleGuard,
} from './features/auth/guards/role.guard';

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
        path: 'login',
        loadComponent: () =>
          import(
            './features/auth/pages/login/login.page'
          ).then(
            (module) =>
              module.LoginPage,
          ),
      },
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
        canActivate: [
          authGuard,
        ],
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
        canActivate: [
          authGuard,
        ],
        loadComponent: () =>
          import(
            './features/account/pages/account/account.page'
          ).then(
            (module) =>
              module.AccountPage,
          ),
      },
      {
        path: 'dashboard-predictivo',
        canActivate: [
          authGuard,
          roleGuard('ADMINISTRADOR'),
        ],
        loadComponent: () =>
          import(
            './features/dashboard/pages/prediction-dashboard/prediction-dashboard.page'
          ).then(
            (module) =>
              module.PredictionDashboardPage,
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
    path: 'vendedor',
    canActivate: [
      authGuard,
      roleGuard('COMERCIANTE'),
    ],
    loadComponent: () =>
      import(
        './layouts/seller-layout/seller-layout.component'
      ).then(
        (module) =>
          module.SellerLayoutComponent,
      ),
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import(
            './features/seller/pages/home/seller-home.page'
          ).then(
            (module) =>
              module.SellerHomePage,
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import(
            './features/seller/pages/products/seller-products.page'
          ).then(
            (module) =>
              module.SellerProductsPage,
          ),
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import(
            './features/seller/pages/product-form/seller-product-form.page'
          ).then(
            (module) =>
              module.SellerProductFormPage,
          ),
      },
      {
        path: 'productos/:productoId/editar',
        loadComponent: () =>
          import(
            './features/seller/pages/product-form/seller-product-form.page'
          ).then(
            (module) =>
              module.SellerProductFormPage,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/seller/pages/dashboard/seller-dashboard.page'
          ).then(
            (module) =>
              module.SellerDashboardPage,
          ),
      },
      {
        path: 'consentimiento',
        loadComponent: () =>
          import(
            './features/seller/pages/consent/seller-consent.page'
          ).then(
            (module) =>
              module.SellerConsentPage,
          ),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'catalogo',
  },
];