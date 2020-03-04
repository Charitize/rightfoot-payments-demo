import { MailingAddressInterface } from './mailing-address.interface';

export interface BeneficiaryRequestInterface {
  /**
   * The given name of the beneficiary.
   */
  firstName: string;
  /**
   * The family name of the beneficiary.
   */
  lastName: string;
  /**
   * A unique identifier for the consuming product
   * used as a customizable foreign key.
   */
  platformId?: string;
  /**
   * Birth date for the beneficiary formatted as YYYY-MM-DD.
   */
  dateOfBirth: string;
  /**
   * Phone number for the beneficiary formatted internationally
   * with spacing such as +1 555 555 5555.
   */
  phoneNumber: string;
  /**
   * Mailing address for the beneficiary, to be provided to payment provider.
   */
  mailingAddress: MailingAddressInterface;
}
