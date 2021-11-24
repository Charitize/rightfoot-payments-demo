import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgxPlaidLinkModule } from 'ngx-plaid-link';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { HeaderComponent } from './header.component';
import { PayLoansComponent } from './pay-loans.component';
import { CreateBeneficiaryComponent } from './create-beneficiary.component';
import { PaymentStatusComponent } from './payment-status.component';
import { PaymentSuccessComponent } from './payment-success.component';
import { StepperComponent } from './stepper.component';
import { SuccessCheckComponent } from './success-check.component';
import { LinkLoanComponent } from './link-loan.component';
import { CreatePaymentComponent } from './create-payment.component';
import { PaymentStatusPanelComponent } from './payment-status-panel.component';
import { IsoDatePipe } from './iso-date.pipe';

/** Primary entry point for the entire application. */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateBeneficiaryComponent,
    CreatePaymentComponent,
    LinkLoanComponent,
    PayLoansComponent,
    PaymentSuccessComponent,
    PaymentStatusComponent,
    StepperComponent,
    SuccessCheckComponent,
    PaymentStatusPanelComponent,
    IsoDatePipe,
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
    MatIconModule,
    MatButtonToggleModule,
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
