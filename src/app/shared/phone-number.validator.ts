import { AbstractControl } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Validates if control's value can be a phone number.
 *
 * parsePhoneNumberFromString returns undefined if it cannot parse
 * a phone number from a string.
 * isValid function is pretty simple in min package as it checks only string length.
 * @param control
 */
export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
  const isValid = control.value && !!parsePhoneNumberFromString(control.value);
  return isValid ? null : {phoneNumber: {value: control.value}};
}
