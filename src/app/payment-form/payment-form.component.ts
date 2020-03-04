import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitedStatesTerritories } from '../shared/us-states-and-territories';
import { phoneNumberValidator } from '../shared/phone-number.validator';
import { ApiService } from '../api.service';

/**
 * This component provides a form with a payment amount input and a "Pay" button.
 * If demographics information is not provided yet,
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
    // TODO(RF-350) create a real handler here.
  }

  get demographicsForm(): FormGroup {
    return this.form.get('demographics') as FormGroup;
  }

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
}
