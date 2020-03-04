/**
 * Interface for a mailing address for a beneficiary,
 * to be provided to payment provider.
 */
export interface MailingAddressInterface {
  /**
   * Mandatory mailing address line.
   */
  line1: string;
  /**
   * Optional second line of an address.
   */
  line2?: string;
  /**
   * The city of the location.
   */
  city: string;
  /**
   * The two-letter state/territory abbreviation.
   */
  state: string;
  /**
   * US Zone Improvement Plan (ZIP) Code, or alternatively ZIP+4 Code.
   */
  zipCode: string;
}
