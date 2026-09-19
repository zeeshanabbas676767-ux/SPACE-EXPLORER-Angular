import { Routes } from '@angular/router';

// Layouts
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Customer Pages
import { HomeComponent } from './customer/pages/home/home.component';
import { exploreUniverseComponent } from './customer/pages/exploreUniverse/exploreUniverse.component';
import { CartComponent } from './customer/pages/cart/cart.component';
import { ShopComponent } from './customer/pages/shop/shop.component'; 
import { AboutComponent } from './customer/pages/about/about.component';
import { CheckoutComponent } from './customer/pages/checkout/checkout.component';
import { ContactComponent } from './customer/pages/contact/contact.component';
import { RegisterComponent } from './customer/pages/register/register.component';
import { LoginComponent } from './customer/pages/login/login.component';

// Admin Pages
import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminProductListComponent } from './admin/pages/products/product.component';
import { AdminOrderListComponent } from './admin/pages/orders/order.component';
import { AdminCategoryComponent } from './admin/pages/categories/category.component';
import { AdminUsersComponent } from './admin/pages/user/user.component';
import { AdminUniverseDataComponent } from './admin/pages/universeData/universeData.component';
import { AdminSpaceRolesComponent } from './admin/pages/spaceRoles/spaceRole.component';
import { AdminSpaceRolesItemsComponent } from './admin/pages/spaceRolesItems/spaceRolesItems.component';
import { AdminRoleComponent } from './admin/pages/Role/Role.component';
import { AdminRegisterComponent } from './admin/pages/register/register.component';
import { AdminLoginComponent } from './admin/pages/login/login.component';

// Guard
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 1. Root Redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 2. Public Customer Routes
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'explore-universe', component: exploreUniverseComponent },
      { path: 'cart', component: CartComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'about', component: AboutComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
    ]
  },

  // 3. Public Admin Auth Routes (MUST BE OUTSIDE THE PROTECTED LAYOUT)
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/register', component: AdminRegisterComponent },

  // 4. Protected Admin Dashboard Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductListComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'orders', component: AdminOrderListComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'universeData', component: AdminUniverseDataComponent },
      { path: 'spaceRoles', component: AdminSpaceRolesComponent },
      { path: 'spaceRolesitems', component: AdminSpaceRolesItemsComponent },
      { path: 'role', component: AdminRoleComponent }
    ]
  },

  // 5. Wildcard Fallback Route (Redirects unknown URLs to Home)
  { path: '**', redirectTo: 'home' }
];