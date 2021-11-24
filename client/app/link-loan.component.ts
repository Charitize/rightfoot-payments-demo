import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { RightfootApiService } from './rightfoot-api.service';
import { StorageService } from './storage.service';
import { PlaidService } from './plaid.service';
import { FormControl, FormGroup } from '@angular/forms';
import { loadVGSCollect } from '@vgs/collect-js';

enum LoanTypes {
  CREDIT_CARD = 'creditCard',
  STUDENT_LOAN = 'studentLoan'
}

/**
 * This component provides a form with a payment amount input and a "Pay" button.
 * If demographics information is not provided yet and plaid is not connected,
 * corresponding form fields will also be visible and available for filling.
 */
@Component({
  selector: 'app-link-loan',
  templateUrl: './link-loan.component.html',
  styleUrls: ['./link-loan.component.scss'],
})
export class LinkLoanComponent implements AfterViewInit {
  constructor(
    private apiService: RightfootApiService,
    private plaidService: PlaidService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  /** To show a loader. */
  public loading = false;

  /** To provide values for the selector. */
  public loanTypes = LoanTypes;

  public form = new FormGroup({
    loanType: new FormControl(null)
  });

  /** Allows to programmatically disable submit button. */
  public isSubmitDisabled = true;

  private vgsForm: any;

  private vgsFieldsInitialized = false;

  async ngAfterViewInit() {
    await this.initializeVgsCollectForm();
    this.loanType.valueChanges.subscribe((loanType) => {
      if (loanType === LoanTypes.STUDENT_LOAN) {
        this.isSubmitDisabled = false;
      } else {
        if (this.vgsFieldsInitialized) {
          // If any of the fields is invalid - then the form is invalid and the submit should be disabled.
          this.isSubmitDisabled = Object.keys(this.vgsForm.state)
            .map((fieldKey) => this.vgsForm.state[fieldKey].isValid)
            .includes(false);
        } else {
          this.isSubmitDisabled = true;
        }
      }
    });
  }

  public get loanType(): FormControl {
    return this.form.get('loanType') as FormControl;
  }

  public onSubmit(event) {
    switch (this.loanType.value) {
      case LoanTypes.STUDENT_LOAN:
        this.onLaunchPlaidLink();
        break;
      case LoanTypes.CREDIT_CARD:
        event.preventDefault();
        this.submitToVgs();
    }
  }

  private submitToVgs() {
    this.vgsForm.submit('/post', {}, (status, response) => {
      console.log(status, response);
      // TODO: Code to send the info to Rightfoot's API.
    }, (error) => {
      console.error('An unexpected error occurred.', error);
    });
  }

  public onLaunchPlaidLink() {
    this.loading = true;
    this.launchPlaidLink().subscribe(
      () => {
        this.loading = false;
      },
      (err) => {
        console.error('An unexpected error occurred.', err);
      },
      ()  => {
        this.loading = false;
      },
    );
  }

  /**
   * Launch Plaid link, either on initialization or to relaunch after close.
   */
  private launchPlaidLink(): Observable<boolean> {
    return this.plaidService.addPlaidLoan().pipe(
        switchMap(plaidResponse => {
          return this.storageService.beneficiaryId$.pipe(
            switchMap(beneficiaryUuid => {
              return this.apiService.addPlaidToken(
                beneficiaryUuid, plaidResponse.token);
            })
          );
        }),
        tap(response => console.log(response)),
        map(beneficiary => beneficiary.paymentsEnabled),
        tap(paymentsEnabled => {
          this.storageService.storePaymentsEnabled(paymentsEnabled);
        })
    );
  }

  private async initializeVgsCollectForm() {
    const collect = await loadVGSCollect({
      vaultId: 'tnty9bkue1i',
      environment: 'sandbox',
      version: '2.11.0'
    }).catch((e) => console.error(e));
    // @ts-ignore
    this.vgsForm = collect.init((state) => {
      if (this.loanType.value === LoanTypes.CREDIT_CARD && this.vgsFieldsInitialized) {
        this.isSubmitDisabled = Object.keys(state)
          .map((fieldKey) => state[fieldKey].isValid)
          .includes(false);
        // Needs to be manually triggered to enable/disable the button
        // because the event is in the iframe.
        this.cdr.detectChanges();
      }
    });
    const css = {
      'box-sizing': 'border-box',
      'font-family': '"Inter", sans-serif',
      'font-size': '14px',
      'line-height': '17px',
      color: '#59537b',
      'caret-color': '#673ab7',
      'font-weight': 'bold',
      '@font-face': {
        'font-family': 'Inter',
        'font-style': 'normal',
        'font-weight': 'bold',
        'font-display': 'swap',
        src: 'local("Inter")',
        'unicode-range': 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'
      },
    };

    const name = this.vgsForm.field('#cc-holder', {
      type: 'text',
      name: 'card_holder',
      placeholder: 'Name on Card',
      validations: ['required'],
      css,
    });

    const ccNumber = this.vgsForm.field('#cc-number', {
      type: 'card-number',
      name: 'card_number',
      successColor: '#4F8A10',
      errorColor: '#f44336',
      placeholder: 'Card Number',
      showCardIcon: true,
      validations: ['required', 'validCardNumber'],
      css,
    });

    const cvc = this.vgsForm.field('#cc-cvc', {
      type: 'card-security-code',
      name: 'card_cvc',
      successColor: '#4F8A10',
      errorColor: '#f44336',
      placeholder: 'CVC',
      maxLength: 3,
      validations: ['required', 'validCardSecurityCode'],
      css,
    });

    const expirationDate = this.vgsForm.field('#cc-expiration-date', {
      type: 'card-expiration-date',
      name: 'card_exp',
      successColor: '#4F8A10',
      errorColor: '#f44336',
      placeholder: 'MM / YY',
      validations: ['required', 'validCardExpirationDate'],
      css,
    });

    Promise.all([
      name.promise,
      ccNumber.promise,
      cvc.promise,
      expirationDate.promise
    ]).then(() => this.vgsFieldsInitialized = true);
  }
}
