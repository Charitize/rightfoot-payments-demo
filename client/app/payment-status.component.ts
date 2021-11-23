import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { map, switchMap, take } from 'rxjs/operators';
import { RightfootApiService } from './rightfoot-api.service';
import { Observable } from 'rxjs';
import { Payment } from 'rightfoot-node/1-3/api';

/**
 * Styled component which is showing Status/Result of the payment via Plaid service.
 */
@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
})
export class PaymentStatusComponent {
  /**
   * Payment status response binding.
   */
  public statusResponse$: Observable<string> =
      this.storageService.paymentStatusResponse$.pipe(
        map((payment: Payment) => {
          return JSON.stringify(
            payment,
            null,
            2
          );
        })
      );

  constructor(
      private apiService: RightfootApiService,
      private storageService: StorageService) {}

  /**
   * Retrieves payment status.
   */
  public checkStatus() {
    this.storageService.paymentId$
      .pipe(
        switchMap((uuid) => this.apiService.getPayment(uuid)),
        take(1))
      .subscribe((payment) => {
        this.storageService.storePaymentResponse(payment);
      });
  }
}
