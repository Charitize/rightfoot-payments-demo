import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { RightfootApiService } from './rightfoot-api.service';
import { StorageService } from './storage.service';
import { PlaidService } from './plaid.service';
import { FormControl, FormGroup } from '@angular/forms';

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
export class LinkLoanComponent {
  constructor(
    private apiService: RightfootApiService,
    private plaidService: PlaidService,
    private storageService: StorageService
  ) {}

  /** To show a loader. */
  public loading = false;

  /** To provide values for the selector. */
  public loanTypes = LoanTypes;

  public form = new FormGroup({
    loanType: new FormControl(null)
  });

  public get loanType(): FormControl {
    return this.form.get('loanType') as FormControl;
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
}
