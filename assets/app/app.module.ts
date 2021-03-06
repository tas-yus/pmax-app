import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AppComponent } from './app.component';
import { HeaderComponent} from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { CourseAsideComponent } from './courses/course-detail/course-aside/course-aside.component';
import { CourseOverviewComponent } from './courses/course-overview/course-overview.component';
import { CartCheckoutComponent } from './cart/cart-checkout/cart-checkout.component';
import { CartDetailComponent } from './cart/cart-detail/cart-detail.component';
import { PartListComponent } from './parts/part-list/part-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VideoComponent } from './videos/video.component';
import { LearnComponent } from './learn/learn.component';
import { LearnOverviewComponent } from './learn/learn-overview/learn-overview.component';
import { YourCourseComponent } from './dashboard/your-course/your-course.component'
import { PurchaseHistoryComponent } from './dashboard/purchase-history/purchase-history.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { CreditCardInfoComponent } from './dashboard/credit-card-info/credit-card-info.component';
import { YourQuestionComponent } from './dashboard/your-question/your-question.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QAndAComponent } from './q-and-a/q-and-a.component';
import { AdminMainComponent } from './admin/admin-main.component';
import { AdminCourseComponent } from './admin/admin-course/admin-course.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminPartComponent } from './admin/admin-part/admin-part.component';
import { AdminVideoComponent } from './admin/admin-video/admin-video.component';
import { AdminCourseDetailComponent } from './admin/admin-course/admin-course-detail/admin-course-detail.component';
import { AdminPartDetailComponent } from './admin/admin-part/admin-part-detail/admin-part-detail.component';
import { AdminVideoDetailComponent } from './admin/admin-video/admin-video-detail/admin-video-detail.component';
import { AdminUserDetailComponent } from './admin/admin-user/admin-user-detail/admin-user-detail.component';
import { AdminCourseEditComponent } from './admin/admin-course/admin-course-edit/admin-course-edit.component';
import { AdminPartEditComponent } from './admin/admin-part/admin-part-edit/admin-part-edit.component';
import { AdminVideoEditComponent } from './admin/admin-video/admin-video-edit/admin-video-edit.component';
import { AdminUserEditComponent } from './admin/admin-user/admin-user-edit/admin-user-edit.component';
import { AdminCourseNewComponent } from './admin/admin-course/admin-course-new/admin-course-new.component';
import { AdminPartNewComponent } from './admin/admin-part/admin-part-new/admin-part-new.component';
import { AdminPartNewFreshComponent } from './admin/admin-part/admin-part-new-fresh/admin-part-new-fresh.component';
import { AdminVideoNewComponent } from './admin/admin-video/admin-video-new/admin-video-new.component';
import { AdminVideoNewFreshComponent } from './admin/admin-video/admin-video-new-fresh/admin-video-new-fresh.component';

import { AvatarComponent } from './misc/avatar/avatar.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { AdminGuard } from './auth/admin-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CourseListComponent,
    CourseDetailComponent,
    CourseAsideComponent,
    CourseOverviewComponent,
    CartCheckoutComponent,
    CartDetailComponent,
    PartListComponent,
    LoginComponent,
    RegisterComponent,
    VideoComponent,
    LearnComponent,
    LearnOverviewComponent,
    DashboardComponent,
    YourCourseComponent,
    PurchaseHistoryComponent,
    EditProfileComponent,
    CreditCardInfoComponent,
    YourQuestionComponent,
    NotFoundComponent,
    QAndAComponent,
    AvatarComponent,
    AdminMainComponent,
    AdminCourseComponent,
    AdminCourseDetailComponent,
    AdminCourseEditComponent,
    AdminCourseNewComponent,
    AdminPartComponent,
    AdminPartDetailComponent,
    AdminPartEditComponent,
    AdminPartNewComponent,
    AdminPartNewFreshComponent,
    AdminVideoComponent,
    AdminVideoDetailComponent,
    AdminVideoEditComponent,
    AdminVideoNewComponent,
    AdminVideoNewFreshComponent,
    AdminUserComponent,
    AdminUserDetailComponent,
    AdminUserEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    OrderModule,
    FilterPipeModule
  ],
  providers: [AuthService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})

export class AppModule {

}
