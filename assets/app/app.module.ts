import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent} from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { CourseAsideComponent } from './courses/course-detail/course-aside/course-aside.component';
import { CourseOverviewComponent } from './courses/course-overview/course-overview.component';
import { PartListComponent } from './parts/part-list/part-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VideoComponent } from './videos/video.component';
import { LearnComponent } from './learn/learn.component';

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
    PartListComponent,
    LoginComponent,
    RegisterComponent,
    VideoComponent,
    LearnComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {
  
}
