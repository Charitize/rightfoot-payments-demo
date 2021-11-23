import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Beneficiary } from 'rightfoot-node/1-3/api';

import { UnitedStatesTerritories } from './us-states-and-territories';
import { phoneNumberValidator } from './phone-number.validator';
import { RightfootApiService } from './rightfoot-api.service';
import { DemographicsFormValue } from './demographics-form-value.interface';
import { StorageService } from './storage.service';
import { PlaidService } from './plaid.service';

/**
 * This component provides a form with a payment amount input and a "Pay" button.
 * If demographics information is not provided yet and plaid is not connected,
 * corresponding form fields will also be visible and available for filling.
 */
@Component({
  selector: 'app-create-beneficiary',
  templateUrl: './create-beneficiary.component.html',
  styleUrls: ['./create-beneficiary.component.scss'],
})
export class CreateBeneficiaryComponent {
  constructor(
    private apiService: RightfootApiService,
    private plaidService: PlaidService,
    private storageService: StorageService
  ) {}

  private get demographicsFormValue(): DemographicsFormValue {
    return this.form.value as DemographicsFormValue;
  }

  /**
   * Form definition with validators.
   */
  public form: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      phoneNumberValidator,
    ]),
    dateOfBirth: new FormControl(null, [Validators.required]),
    mailingAddress: new FormGroup({
      line1: new FormControl(null, [Validators.required]),
      line2: new FormControl(null),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [
        Validators.required,
        Validators.pattern('\\d{5}(-\\d{4})?'),
      ]),
    }),
  });

  /**
   * Exposing array of the USA states and territories to the template.
   */
  public states = UnitedStatesTerritories;

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

    this.createBeneficiary().subscribe(
      () => {
        this.loading = false;
        this.form.enable();
      }
    );
  }

  private createBeneficiary(): Observable<Beneficiary> {
    return this.apiService
      .createBeneficiary(this.demographicsFormValue)
      .pipe(
          tap(beneficiary => {
            this.storageService.storeBeneficiaryId(beneficiary);
          })
      );
  }

  /**
   * Set demo values to the form
   */
  fillExampleData() {
    this.form.setValue({
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
    });
  }
}
