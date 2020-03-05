import { MailingAddress } from './mailing-address.interface';

export interface DemographicsFormValue {
  /**
   * The given name of the beneficiary.
   */
  firstName: string;
  /**
   * The family name of the beneficiary.
   */
  lastName: string;
  /**
   * Birth date for the beneficiary formatted as YYYY-MM-DD.
   */
  dateOfBirth: Date;
  /**
   * Phone number for the beneficiary inputted by user.
   */
  phoneNumber: string;
  /**
   * Mailing address for the beneficiary, to be provided to payment provider.
   */
  mailingAddress: MailingAddress;
}
