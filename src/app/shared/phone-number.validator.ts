import { AbstractControl } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
  const isValid = control.value && !!parsePhoneNumberFromString(control.value);
  return isValid ? null : {phoneNumber: {value: control.value}};
}
