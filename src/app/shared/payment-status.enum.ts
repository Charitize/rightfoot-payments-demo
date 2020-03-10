/**
 * @link Payment
 */
export enum PaymentStatus {
  /**
   * Payment request accepted by processors.
   * Will update over several days until payment is completed.
   */
  ACCEPTED = 'ACCEPTED',
  /** Payments verified to have been disbursed. */
  COMPLETED = 'COMPLETED',
  /** Payment is more than balance and note necessary. */
  RETURNED = 'RETURNED',
  /** An irrecoverable error in processing has occurred. */
  FAILED = 'FAILED'
}
