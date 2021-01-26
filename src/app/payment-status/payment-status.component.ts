import { Component, OnDestroy } from '@angular/core';
import { StorageService } from '../storage.service';
import { switchMap } from 'rxjs/operators';
import { RightfootApiService } from '../rightfoot-api.service';
import { Subscription } from 'rxjs';

/**
 * Styled component which is showing Status/Result of the payment via Plaid service.
 */
@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
})
export class PaymentStatusComponent implements OnDestroy {
  private subscription: Subscription;
  /**
   * Payment status response binding.
   */
  statusResponse: string;

  constructor(
    private apiService: RightfootApiService,
    private storageService: StorageService
  ) {
    this.statusResponse = JSON.stringify(
      JSON.parse(this.storageService.getStoredPlaidResponse()),
      null,
      2
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Retrieves payment status
   */
  public checkStatus() {
    this.subscription = this.storageService.storedPaymentUuid$
      .pipe(switchMap((uuid) => this.apiService.getPayment(uuid)))
      .subscribe((payment) => {
        this.statusResponse = JSON.stringify(JSON.parse(payment.toString()), null, 2);
      });
  }
}
