import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { environment } from '../environments/environment';
import { DemographicsFormValue } from './shared/demographics-form-value.interface';
import { BeneficiaryRequest } from './shared/beneficiary-request.interface';
import { Observable } from 'rxjs';
import { Beneficiary } from './shared/beneficiary.interface';
import { StorageService } from './storage.service';
import { Payment } from './shared/payment.interface';
import { map, tap } from 'rxjs/operators';
import { BeneficiaryResponse } from './shared/beneficiary-response.interface';
import { AddPlaidTokenRequest } from './shared/add-plaid-token-request';
import { CreatePaymentRequest } from './shared/create-payment-request.interface';
import { PaymentResponse } from './shared/payment-response.interface';

/**
 * This service is used for communication with the API server
 * to create beneficiaries, make payments, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private CREATE_BENEFICIARY_URL = `${environment.apiUrl}/beneficiaries`;
  private ADD_PLAID_TOKEN_URL = `${environment.apiUrl}/beneficiaries/addPlaidToken`;
  private PAYMENTS_URL = `${environment.apiUrl}/payments`;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Creates new beneficiary user based on the user provided demographics data.
   * @param formValue Value of the demographics form group.
   * @returns Observable<Beneficiary> newly created beneficiary user.
   */
  createBeneficiary(formValue: DemographicsFormValue): Observable<Beneficiary> {
    const request: BeneficiaryRequest = {
      ...formValue,
      dateOfBirth: formatDate(formValue.dateOfBirth, 'yyyy-MM-dd', 'en-US'),
      phoneNumber: parsePhoneNumberFromString(formValue.phoneNumber).formatInternational()
    };

    return this.httpClient.post<BeneficiaryResponse>(this.CREATE_BENEFICIARY_URL, request).pipe(
      map(response => response.beneficiary),
      tap(beneficiary => StorageService.storeUserId(beneficiary))
    );
  }

  /**
   * Connects Plaid Public Token with a beneficiary.
   * Enables payments.
   *
   * @param beneficiaryUuid Unique identifier generated by Rightfoot.
   * @param plaidPublicToken Public token obtained from Plaid
   * using Rightfoot's Plaid public key.
   */
  public addPlaidToken(beneficiaryUuid: string, plaidPublicToken: string) {
    const request: AddPlaidTokenRequest = {
      uuid: beneficiaryUuid,
      plaidPublicToken
    };

    return this.httpClient.post<BeneficiaryResponse>(this.ADD_PLAID_TOKEN_URL, request).pipe(
      map(response => response.beneficiary),
      tap(beneficiary => StorageService.storePaymentsEnabled(beneficiary.paymentsEnabled))
    );
  }

  /**
   * Issues a request to transfer funds from the funding source to the beneficiary's loan account.
   * @param beneficiaryUuid Unique identifier generated by Rightfoot.
   * @param amount Amount in USD provided by a user and parsed as a float.
   */
  public createPayment(beneficiaryUuid: string, amount: number): Observable<Payment> {
    const request: CreatePaymentRequest = {
      beneficiaryUuid,
      paymentAmount: parseFloat(amount.toFixed(2)) * 100
    };

    return this.httpClient.post<PaymentResponse>(this.PAYMENTS_URL, request).pipe(
      map(response => response.payment),
      tap(payment => StorageService.storePaymentUuid(payment.uuid))
    );
  }

  /**
   * This request retrieves an existing payment, updated with the latest status
   * of its processing along with error information.
   * @param uuid Unique identifier generated by Rightfoot for the payment.
   */
  public getPayment(uuid: string): Observable<Payment> {
    return this.httpClient.get<PaymentResponse>(`${this.PAYMENTS_URL}/${uuid}`)
      .pipe(map(response => response.payment));
  }
}
