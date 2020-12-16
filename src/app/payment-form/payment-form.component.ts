import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitedStatesTerritories } from '../shared/us-states-and-territories';
import { phoneNumberValidator } from '../shared/phone-number.validator';
import { RightfootApiService } from '../rightfoot-api.service';
import { DemographicsFormValue } from '../shared/demographics-form-value.interface';
import { StorageService } from '../storage.service';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { PlaidService } from '../plaid.service';
import { Payment } from '../shared/payment.interface';

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
  constructor(private apiService: RightfootApiService,
              private plaidService: PlaidService,
              private storageService: StorageService) {
  }

  private get demographicsFormValue(): DemographicsFormValue {
    return this.form.get('demographics').value as DemographicsFormValue;
  }

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
    amount: new FormControl('', [ Validators.required ])
  });

  /**
   * Exposing array of the USA states and territories to the template.
   */
  public states = UnitedStatesTerritories;

  /**
   * Exposing this value to dynamically show/hide demographics related template.
   */
  public isDemographicsInfoProvided = !!this.storageService.getStoredUserId();

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

    this.createPayment().subscribe(
      () => {
        this.loading = false;
        this.form.enable();
      },
      (error) => {
        // Very basic error handling.
        this.loading = false;
        this.form.enable();
        this.storageService.clearAll();
        this.storageService.storeCurrentStep(1);
        console.error(error);
        console.warn('Something went wrong and the application state is cleared. ' +
          'Please reload this page and try again.');
      }, () => {
        // If user close plaid view we should show enabled previous form
        this.loading = false;
        this.form.enable();
        this.storageService.storeCurrentStep(1);
      });
  }

  /**
   * Performs all required actions based on currently available data
   * to create a payment.
   */
  private createPayment(): Observable<Payment> {
    return combineLatest([
      this.getUserIdStream(),
      this.getPlaidTokenStream()
    ]).pipe(
      take(1),
      switchMap(([uuid, plaidToken]) => {
        this.storageService.storeCurrentStep(2);
        return this.getPaymentsEnabledStream(uuid, plaidToken);
      }),
      switchMap(paymentsEnabled => {
        this.storageService.storeCurrentStep(3);
        if (paymentsEnabled) {
          return this.apiService.createPayment(
            this.storageService.getStoredUserId(),
            this.amount
          );
        }
        return throwError(
            'Payments are not enabled. ' +
            'Something went wrong with linking the user with the plaid token.');
      })
    );
  }

  /**
   * Returns cached user id if present or performs create beneficiary request otherwise.
   */
  private getUserIdStream(): Observable<string> {
    const storedUserId = this.storageService.getStoredUserId();
    if (!storedUserId) {
      return this.apiService.createBeneficiary(this.demographicsFormValue)
        .pipe(map(beneficiary => beneficiary.uuid));
    }
    return of(storedUserId);
  }

  /**
   * Returns cached plaid token if present or launches Plaid Link otherwise.
   */
  private getPlaidTokenStream(): Observable<string> {
    const storedToken = this.storageService.getStoredPlaidToken();
    if (!storedToken) {
      return this.plaidService.addPlaidLoan()
        .pipe(map(plaidResponse => plaidResponse.token));
    }
    return of(storedToken);
  }

  /**
   * Returns cached payments enabled value if present or connects plaid token to a user otherwise.
   * @param beneficiaryUuid Unique identifier generated by Rightfoot.
   * @param token Public token obtained from Plaid using Rightfoot's Plaid public key.
   */
  private getPaymentsEnabledStream(beneficiaryUuid: string, token: string): Observable<boolean> {
    const storedPaymentsEnabled = this.storageService.getStoredPaymentsEnabled();
    // If stored payments is null it means it wasn't set yet
    // so addPlaidToken request hasn't been performed yet.
    if (storedPaymentsEnabled === null) {
      return this.apiService.addPlaidToken(beneficiaryUuid, token)
        .pipe(map(beneficiary => beneficiary.paymentsEnabled));
    }
    return of(storedPaymentsEnabled);
  }

  fillExampleData() {
    const demographics = this.form.controls.demographics as FormGroup;

    demographics.controls.firstName.setValue('John');
    demographics.controls.lastName.setValue('Doe');
    demographics.controls.phoneNumber.setValue('+1234567890');
    demographics.controls.dateOfBirth.setValue(new Date('12/1/1980'));

    const mailing = demographics.controls.mailingAddress as FormGroup;
    mailing.controls.line1.setValue('1600 Pennsylvania Avenue');
    mailing.controls.city.setValue('Washington');
    mailing.controls.state.setValue('DC');
    mailing.controls.zipCode.setValue('20001');

    this.form.controls.amount.setValue(100);
  }
}
