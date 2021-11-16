import { Payment } from './payment.interface';

/**
 * This interface describes a response from the public API regarding payments.
 * E.g. create payment request.
 */
export interface PaymentResponse {
  payment: Payment;
}
