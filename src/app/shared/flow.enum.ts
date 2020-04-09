/**
 * This enum defines flows our app can behave in.
 * @link FlowService
 */
export enum Flow {
  /**
   * The default way. App asks for required demographics information
   * to make payments, uses plaid link to gather information about loans,
   * creates a user and makes a payment using application's monolithic funding source.
   */
  MONOLITHIC,
  /**
   * This flow allows to add a funding source dynamically via plaid link and asking for
   * Social Security Number in addition to the default information.
   */
  DYNAMIC
}
