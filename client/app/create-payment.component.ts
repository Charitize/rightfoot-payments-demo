import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Payment } from 'rightfoot-node/1-3/api';

import { RightfootApiService } from './rightfoot-api.service';
import { StorageService } from './storage.service';
import { PlaidService } from './plaid.service';

/**
 * This component provides a form with a payment amount input and a "Pay" button.
 * If demographics information is not provided yet and plaid is not connected,
 * corresponding form fields will also be visible and available for filling.
 */
@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss'],
})
export class CreatePaymentComponent {
  constructor(
    private apiService: RightfootApiService,
    private plaidService: PlaidService,
    private storageService: StorageService
  ) {}

  /**
   * Returns amount value as a float.
   */
  private get amount(): number {
    const value = this.form.get('amount').value;
    if (value === undefined) {
      return null;
    }
    return parseFloat(value);
  }

  /**
   * Form definition with validators.
   */
  public form: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required]),
  });

  /** To show a loader. */
  public loading = false;

  /**
   * Form submit handler.
   */
  public onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.form.disable();

    this.createPayment().subscribe(
      () => {
        this.loading = false;
        this.form.enable();
      }
    );
  }

  private createPayment(): Observable<Payment> {
    return this.storageService.beneficiaryId$.pipe(
      switchMap(beneficiaryId => {
        return this.apiService.createPayment(
            beneficiaryId, this.amount);
      }),
      tap(payment => {
        this.storageService.storePaymentId(payment.uuid);
        this.storageService.storePaymentResponse(payment);
      })
    );
  }

  /**
   * Set demo values to the form
   */
  fillExampleData() {
    this.form.setValue({
      demographics: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        dateOfBirth: new Date('12/1/1980'),
        mailingAddress: {
          line1: '1600 Pennsylvania Avenue',
          line2: '',
          city: 'Washington',
          state: 'DC',
          zipCode: '20001',
        },
      },
      amount: 100,
    });
  }
}
