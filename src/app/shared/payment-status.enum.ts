/**
 * @link Payment
 */
export enum PaymentStatus {
  /**
   * Payment request has been issued.
   * Will update over several days until payment is completed.
   */
  PENDING = 'PENDING',
  /** Payments verified to have been disbursed. */
  COMPLETED = 'COMPLETED',
  /** Payment is more than balance and note necessary. */
  RETURNED = 'RETURNED',
  /** An irrecoverable error in processing has occurred. */
  FAILED = 'FAILED'
}
