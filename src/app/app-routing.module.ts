import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayLoansComponent } from "./pay-loans/pay-loans.component";


const routes: Routes = [
  {
    path: '',
    component: PayLoansComponent,
    pathMatch: 'full'
  }
];

/** Routing for the application module. */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
