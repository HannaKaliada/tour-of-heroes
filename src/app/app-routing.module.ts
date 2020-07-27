import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// This tells the router to match that URL to path: 'heroes'
// and display the HeroesComponent when the URL is something like localhost: 4200 / heroes.
// https://angular.io/tutorial/toh-pt5#routes
const routes: Routes = [
  // This route redirects a URL that fully matches the empty path to the route whose path is '/dashboard'.
  // https://angular.io/tutorial/toh-pt5#add-a-default-route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  // The colon (:) in the path indicates that :id is a placeholder for a specific hero id.
  // https://angular.io/tutorial/toh-pt5#add-a-hero-detail-route
  { path: 'detail/:id', component: HeroDetailComponent },
];

@NgModule({
  // https://angular.io/tutorial/toh-pt5#routermoduleforroot
  // The following line adds the RouterModule to the AppRoutingModule
  // imports array and configures it with the routes in one step by calling RouterModule.forRoot()
  imports: [RouterModule.forRoot(routes)],
  // AppRoutingModule exports RouterModule so it will be available throughout the app.
  exports: [RouterModule],
})
export class AppRoutingModule {}
