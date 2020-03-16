import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitedStatesTerritories } from '../shared/us-states-and-territories';
import { phoneNumberValidator } from '../shared/phone-number.validator';
import { ApiService } from '../api.service';
import { DemographicsFormValue } from '../shared/demographics-form-value.interface';

/**
 * This component provides a form with a payment amount input and a "Pay" button.
 * If demographics information is not provided yet and plaid is not connected,
 * corresponding form fields will also be visible and available for filling.
 */
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: [ './payment-form.component.scss' ]
})
export class PaymentFormComponent implements OnInit {
  constructor(private apiService: ApiService) {
  }

  /**
   * Form definition with validators.
   */
  public form: FormGroup = new FormGroup({
    amount: new FormControl('', [ Validators.required ])
  });

  /**
   * Exposing array of the USA states and territories to the template.
   */
  public states = UnitedStatesTerritories;

  // TODO(RF-351) this value should be calculated dynamically.
  public isDemographicsInfoProvided = false;

  /** To show a loader. */
  public loading = false;

  private static initializeDemographicsFormGroup(): FormGroup {
    return new FormGroup({
      firstName: new FormControl(null, [ Validators.required ]),
      lastName: new FormControl(null, [ Validators.required ]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        phoneNumberValidator
      ]),
      dateOfBirth: new FormControl(null, [ Validators.required ]),
      mailingAddress: PaymentFormComponent.initializeMailingAddressFormGroup()
    });
  }

  private static initializeMailingAddressFormGroup(): FormGroup {
    return new FormGroup({
      line1: new FormControl(null, [ Validators.required ]),
      line2: new FormControl(null),
      city: new FormControl(null, [ Validators.required ]),
      state: new FormControl(null, [ Validators.required ]),
      zipCode: new FormControl(null, [
        Validators.required,
        Validators.pattern('\\d{5}(-\\d{4})?')
      ])
    });
  }

  ngOnInit() {
    // We add demographics related fields dynamically if they are not provided yet.
    if (!this.isDemographicsInfoProvided) {
      this.form.addControl(
        'demographics',
        PaymentFormComponent.initializeDemographicsFormGroup()
      );
    }
  }

  /**
   * Form submit handler.
   */
  public onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.form.disable();
    if (!this.isDemographicsInfoProvided) {
      // This observable will probably change in RF-351.
      this.apiService.createBeneficiary(this.demographicsFormValue)
        .subscribe(beneficiary => {
          // TODO(RF-351) call plaid here.
          this.loading = false;
          this.form.enable();
        });
    }
  }

  get demographicsFormValue(): DemographicsFormValue {
    return this.form.get('demographics').value as DemographicsFormValue;
  }
}
