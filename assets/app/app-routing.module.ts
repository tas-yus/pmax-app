import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { CartCheckoutComponent } from './cart/cart-checkout/cart-checkout.component';
import { CartDetailComponent } from './cart/cart-detail/cart-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VideoComponent } from './videos/video.component';
import { LearnComponent } from './learn/learn.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { YourCourseComponent } from './dashboard/your-course/your-course.component';
import { PurchaseHistoryComponent } from './dashboard/purchase-history/purchase-history.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { CreditCardInfoComponent } from './dashboard/credit-card-info/credit-card-info.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AdminGuard } from './auth/admin-guard.service';
import { AdminMainComponent } from './admin/admin-main.component';
import { AdminCourseComponent } from './admin/admin-course/admin-course.component';
import { AdminPartComponent } from './admin/admin-part/admin-part.component';
import { AdminVideoComponent } from './admin/admin-video/admin-video.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminCourseDetailComponent } from './admin/admin-course/admin-course-detail/admin-course-detail.component';
import { AdminPartDetailComponent } from './admin/admin-part/admin-part-detail/admin-part-detail.component';
import { AdminVideoDetailComponent } from './admin/admin-video/admin-video-detail/admin-video-detail.component';
import { AdminUserDetailComponent } from './admin/admin-user/admin-user-detail/admin-user-detail.component';
import { AdminCourseEditComponent } from './admin/admin-course/admin-course-edit/admin-course-edit.component';
import { AdminPartEditComponent } from './admin/admin-part/admin-part-edit/admin-part-edit.component';
import { AdminVideoEditComponent } from './admin/admin-video/admin-video-edit/admin-video-edit.component';
import { AdminUserEditComponent } from './admin/admin-user/admin-user-edit/admin-user-edit.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:courseCode', component: CourseDetailComponent },
  { path: 'courses/:courseCode/learn', component: LearnComponent, canActivate: [AuthGuard] },
  { path: 'cart/checkout', component: CartCheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart/checkout/:courseCode', component: CartCheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartDetailComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
    { path: '', component: YourCourseComponent, pathMatch: 'full' },
    { path: 'purchase', component: PurchaseHistoryComponent },
    { path: 'edit', component: EditProfileComponent },
    { path: 'credit', component: CreditCardInfoComponent },
  ] },
  { path: 'courses/:courseCode/parts/:partCode/videos/:videoCode', component: VideoComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminMainComponent, canActivate: [AuthGuard, AdminGuard], children: [
    { path: 'courses', component: AdminCourseComponent },
    { path: 'courses/:id', component: AdminCourseDetailComponent },
    { path: 'courses/:id/edit', component: AdminCourseEditComponent },
    { path: 'parts', component: AdminPartComponent },
    { path: 'parts/:id', component: AdminPartDetailComponent },
    { path: 'parts/:id/edit', component: AdminPartEditComponent },
    { path: 'videos', component: AdminVideoComponent },
    { path: 'videos/:id', component: AdminVideoDetailComponent },
    { path: 'videos/:id/edit', component: AdminVideoEditComponent },
    { path: 'users', component: AdminUserComponent },
    { path: 'users/:id', component: AdminUserDetailComponent },
    { path: 'users/:id/edit', component: AdminUserEditComponent }
  ] },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
