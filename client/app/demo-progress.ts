/**
 * Enum to represent overall status of user consuming demo app.
 */
export enum DemoProgress {
  /** Beneficiary needs to be created. */
  CREATE_BENEFICIARY = 0,
  /** Beneficiary created, and loan needs to be linked. */
  LINK_LOAN = 1,
  /** Loan linked, and payment needs to be created. */
  CREATE_PAYMENT = 2,
  /** Payment created, and status of it can be checked. */
  CHECK_PAYMENT = 3,
}
