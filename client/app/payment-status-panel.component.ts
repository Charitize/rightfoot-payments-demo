import { Component, Input, OnInit } from '@angular/core';
import { Payment } from 'rightfoot-node/1-3/api';

enum PaymentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED',
  FAILED = 'FAILED'
}

/**
 * Simple card that displays various payment's properties, status in particular,
 * in a pretty way.
 */
@Component({
  selector: 'app-payment-status-panel',
  templateUrl: './payment-status-panel.component.html',
  styleUrls: ['./payment-status-panel.component.scss']
})
export class PaymentStatusPanelComponent implements OnInit {
  /* Required to pass to this component. */
  @Input() payment: Payment;

  /** Status-based CSS class for the panel. */
  public cssClass: string;

  /**
   * Titles map based on a payment's status reason.
   */
  public paymentTitles = {
    ACH_WITHDRAWAL_PENDING_SCHEDULING: 'ACH withdrawal pending scheduling',
    ACH_WITHDRAWAL_CANCELLED: 'ACH withdrawal cancelled',
    ACH_WITHDRAWAL_SCHEDULED: 'ACH withdrawal scheduled',
    ACH_WITHDRAWAL_SUCCESSFUL: 'ACH withdrawal successful',
    ACH_WITHDRAWAL_FAILED: 'ACH withdrawal failed',
    ACH_WITHDRAWAL_RETURNED: 'ACH withdrawal returned',
    PAYMENT_DELIVERY_PENDING: 'Payment delivery pending',
    PAYMENT_DELIVERY_FAILED: 'Payment delivery failed',
  };

  /** To render an icon. */
  public statuses = PaymentStatus;

  ngOnInit() {
    this.cssClass = 'status-panel--' + this.payment.status.toString().toLowerCase();
  }
}
