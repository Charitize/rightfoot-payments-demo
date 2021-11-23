import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { switchMap, take } from 'rxjs/operators';
import { RightfootApiService } from './rightfoot-api.service';

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
  statusResponse: string;

  constructor(
    private apiService: RightfootApiService,
    private storageService: StorageService
  ) {
    this.statusResponse = JSON.stringify(
      this.storageService.getStoredPaymentResponse(),
      null,
      2
    );
  }

  /**
   * Retrieves payment status.
   */
  public checkStatus() {
    this.storageService.storedPaymentUuid$
      .pipe(
        switchMap((uuid) => this.apiService.getPayment(uuid)),
        take(1))
      .subscribe((payment) => {
        this.statusResponse = JSON.stringify(payment, null, 2);
      });
  }
}
