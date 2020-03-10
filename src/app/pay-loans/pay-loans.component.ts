import { Component } from '@angular/core';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';

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
  /**
   * When true, shows PaymentSuccessComponent, otherwise PaymentFormComponent is rendered.
   * @link PaymentSuccessComponent
   * @link PaymentFormComponent
   */
  public isPaymentCreated$ = StorageService.storedPaymentUuid$.pipe(map(id => !!id));
}
