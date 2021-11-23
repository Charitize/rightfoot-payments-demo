import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { map, tap } from 'rxjs/operators';

/**
 * This is a page container component for making loan payments
 * and collecting demographics information.
 */
@Component({
  selector: 'app-pay-loans',
  templateUrl: './pay-loans.component.html',
  styleUrls: ['./pay-loans.component.scss']
})
export class PayLoansComponent {
  constructor(private storageService: StorageService) {
  }

  /**
   * When true, shows PaymentStatusComponent, otherwise PaymentFormComponent is rendered.
   * @link PaymentSuccessComponent
   * @link PaymentFormComponent
   */
  public isPaymentCreated$ = this.storageService.storedPaymentUuid$.pipe(
    map(id => !!id),
    tap(() => {
      // Fixes bug on mobile, when scroll didn't work after receiving token from plaid.
      setTimeout(() => {
        // When a displayed component is changed,
        // scroll to the top of the page.
        window.scroll(0, 0);
      });
    })
  );
}
