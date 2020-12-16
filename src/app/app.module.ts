import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayLoansComponent } from './pay-loans/pay-loans.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { StepperComponent } from './stepper/stepper.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { SuccessCheckComponent } from './success-check/success-check.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthInterceptor } from './auth.interceptor';
import { MatIconModule } from '@angular/material/icon';

/** Primary entry point for the entire application. */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaymentFormComponent,
    PayLoansComponent,
    PaymentSuccessComponent,
    PaymentStatusComponent,
    StepperComponent,
    SuccessCheckComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPlaidLinkModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
