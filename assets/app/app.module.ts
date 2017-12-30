import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';

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
import { NotFoundComponent } from './not-found/not-found.component';
import { QAndAComponent } from './q-and-a/q-and-a.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';

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
    NotFoundComponent,
    QAndAComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    OrderModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {

}
