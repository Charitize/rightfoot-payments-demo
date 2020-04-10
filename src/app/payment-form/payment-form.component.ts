import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitedStatesTerritories } from '../shared/us-states-and-territories';
import { phoneNumberValidator } from '../shared/phone-number.validator';
import { RightfootApiService } from '../rightfoot-api.service';
import { DemographicsFormValue } from '../shared/demographics-form-value.interface';
import { StorageService } from '../storage.service';
import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { PlaidService } from '../plaid.service';
import { Payment } from '../shared/payment.interface';
import { FlowService } from '../flow.service';
import { Flow } from '../shared/flow.enum';

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
export class PaymentFormComponent implements OnInit, OnDestroy {
  private static readonly ssnControlName = 'socialSecurityNumber';
  private static readonly fundingSourceControlName = 'fundingSource';

  constructor(private apiService: RightfootApiService,
              private plaidService: PlaidService,
              private storageService: StorageService,
              private flowService: FlowService) {
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

  /**
   * Exposing this value fot the template for conditional
   * rendering of this flow's specific controls.
   */
  public isDynamicFlowActive$ = this.flowService.activeFlow$.pipe(
    map(flow => flow === Flow.DYNAMIC)
  );

  private componentDestroyed$ = new Subject<boolean>();

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
      this.subscribeToActiveFlow();
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  /** Exposing this value to conditionally disable funding source button. */
  public isFundingSourceLinked() {
    return this.form.get('fundingSource').valid;
  }

  /**
   * Opens Plaid Link and stores Plaid token in the form value
   * to attach it to the beneficiary on submit.
   */
  public linkFundingSource() {
    this.plaidService.getFundingSource().subscribe(response => {
      this.form
        .get(PaymentFormComponent.fundingSourceControlName)
        .setValue(response.token);
    });
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
        console.error(error);
        console.warn('Something went wrong and the application state is cleared. ' +
          'Please reload this page and try again.');
      });
  }

  /**
   * Performs all required actions based on currently available data
   * to create a payment.
   */
  private createPayment(): Observable<Payment> {
    let isDynamicFlowActive = false;
    return combineLatest([
      // Create user or retrieve existing id.
      this.getUserIdStream(),
      // Launch plaid link for loans.
      this.getPlaidTokenStream(),
      // Retrieve if flow is dynamic to store it once.
      this.isDynamicFlowActive$
    ]).pipe(
      take(1),
      // Sets flow value and attaches plaid token to the beneficiary if it is not attached yet.
      switchMap(([uuid, plaidToken, isFlowDynamic]) => {
        isDynamicFlowActive = isFlowDynamic;
        return this.getPaymentsEnabledStream(uuid, plaidToken);
      }),
      // Verify beneficiary if current flow is dynamic.
      switchMap(() => {
        if (isDynamicFlowActive) {
          return this.apiService.verifyBeneficiary(
            this.storageService.getStoredUserId(),
            this.form.get(PaymentFormComponent.ssnControlName).value
          );
        }
        return of(null);
      }),
      // Attach funding source to the beneficiary if flow is dynamic.
      switchMap(() => {
        if (isDynamicFlowActive) {
          return this.apiService.createFundingSource(
            this.storageService.getStoredUserId(),
            this.form.get(PaymentFormComponent.fundingSourceControlName).value
          )
        }
        return of(null);
      }),
      // At last, if payments are enabled by backend, create one.
      switchMap(() => {
        if (this.storageService.getStoredPaymentsEnabled()) {
          return this.apiService.createPayment(
            this.storageService.getStoredUserId(),
            this.amount
          );
        }
        return throwError(
            'Payments are not enabled. ' +
            'Something went wrong with linking the user with the plaid token.');
      }),
      takeUntil(this.componentDestroyed$)
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

  private subscribeToActiveFlow() {
    this.flowService.activeFlow$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(flow => {
        const formContainsSsn = this.form.contains(PaymentFormComponent.ssnControlName);
        if (Flow.MONOLITHIC === flow && formContainsSsn) {
          this.removeSsnFromFormGroup();
          this.removeFundingSourceFromFormGroup();
        } else if (Flow.DYNAMIC === flow && !formContainsSsn) {
          this.addSsnToFormGroup();
          this.addFundingSourceToFormGroup();
        }
      });
  }

  private removeSsnFromFormGroup() {
    this.form.removeControl(PaymentFormComponent.ssnControlName);
  }

  private addSsnToFormGroup() {
    this.form.addControl(
      PaymentFormComponent.ssnControlName,
      new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?!000|666)[0-8][0-9]{2}(?!00)[0-9]{2}(?!0000)[0-9]{4}$/
        )
      ])
    );
  }

  private removeFundingSourceFromFormGroup() {
    this.form.removeControl(PaymentFormComponent.fundingSourceControlName);
  }

  private addFundingSourceToFormGroup() {
    this.form.addControl(
      PaymentFormComponent.fundingSourceControlName,
      new FormControl(null, Validators.required)
    );
  }
}
