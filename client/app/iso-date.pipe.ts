import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Transforms date values into ISO dates containing a year, a month and a day.
 */
@Pipe({
  name: 'isoDate',
})
export class IsoDatePipe implements PipeTransform {
  /**
   * The date/time components to include, using predefined options or a
   * custom format string.
   */
  readonly format = 'yyyy-MM-dd';

  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   * @returns A date string in the ISO 8601 format.
   */
  transform(value: any): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, this.format);
  }
}
