import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { HomeComponent } from './customer/pages/home/home.component';
import { exploreUniverseComponent } from './customer/pages/exploreUniverse/exploreUniverse.component';
import { CartComponent } from './customer/pages/cart/cart.component';
import { ShopComponent } from './customer/pages/shop/shop.component'; 

import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminProductListComponent } from './admin/pages/products/product.component';
import { AdminOrderListComponent } from './admin/pages/orders/order.component';
 import { AdminCategoryComponent } from './admin/pages/categories/category.component';
import { AboutComponent } from './customer/pages/about/about.component';
import { CheckoutComponent } from './customer/pages/checkout/checkout.component';
import { ContactComponent } from './customer/pages/contact/contact.component';
import { RegisterComponent } from './customer/pages/register/register.component';
import { LoginComponent } from './customer/pages/login/login.component';
import { AdminUsersComponent } from './admin/pages/user/user.component';
import { AdminPlanetComponent } from './admin/pages/planets/planets.component';
import { AdminMoonComponent } from './admin/pages/moon/moon.component';
import { AdminGalaxyComponent } from './admin/pages/galaxy/galaxy.component';
import { AdminAsteroidComponent } from './admin/pages/asteroid/asteroid.component';
import { AdminExoPlanetComponent } from './admin/pages/exoPlanet/exoPlanet.component';
import { AdminUniverseDataComponent } from './admin/pages/universeData/universeData.component';
//import { AdminGuard } from './guards/auth.guard';
//import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  

  
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'explore-universe', component: exploreUniverseComponent },
      { path: 'cart', component: CartComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'cart', component: CartComponent },
      { path: 'about', component: AboutComponent},
      { path: 'checkout', component: CheckoutComponent},
      { path: 'contact', component: ContactComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'login', component: LoginComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // { path: 'cart', canActivate: [AuthGuard],
      // loadComponent: () => import('./customer/pages/cart/cart.component').then(m => m.CartComponent) }
    ]
  },
{
  path: 'admin',
  component: AdminLayoutComponent,
  children: [
    { path: 'dashboard', component: AdminDashboardComponent },
    { path: 'products', component: AdminProductListComponent },
    { path: 'category', component: AdminCategoryComponent },
    { path: 'orders', component: AdminOrderListComponent },
    { path: 'users', component: AdminUsersComponent},
    {path: 'planet', component: AdminPlanetComponent},
    {path: 'moon', component: AdminMoonComponent}, 
    {path: 'galaxy', component: AdminGalaxyComponent},
    {path: 'asteroid', component: AdminAsteroidComponent},
    {path: 'exoPlanet', component: AdminExoPlanetComponent},
    {path: 'universeData', component: AdminUniverseDataComponent}
    
   // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
   // { path: 'orders', canActivate: [AdminGuard], loadComponent: () => import('./admin/pages/orders/order.component').then(m => m.AdminOrderListComponent) }
  ]
}

];
