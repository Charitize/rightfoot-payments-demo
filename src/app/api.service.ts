import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { environment } from '../environments/environment';
import { DemographicsFormValueInterface } from './shared/demographics-form-value.interface';
import { BeneficiaryRequestInterface } from './shared/beneficiary-request.interface';
import { Observable } from 'rxjs';
import { BeneficiaryInterface } from './shared/beneficiary.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private CREATE_BENEFICIARY_URL = `${environment.apiUrl}/beneficiaries`;

  constructor(private httpClient: HttpClient) {
  }

  createBeneficiary(formValue: DemographicsFormValueInterface) {
    const request: BeneficiaryRequestInterface = {
      ...formValue,
      dateOfBirth: formatDate(formValue.dateOfBirth, 'yyyy-MM-dd', 'en-US'),
      phoneNumber: parsePhoneNumberFromString(formValue.phoneNumber).formatInternational()
    };

    // TODO remove mocks when the backend will be ready.
    const mockResponse: BeneficiaryInterface = {
      ...request,
      uuid: 'uuid-1234',
      paymentsEnabled: true
    };

    // return this.httpClient.post(this.CREATE_BENEFICIARY_URL, request)
    return new Observable<BeneficiaryInterface>(
      (subscriber => {
        setTimeout(() => {
          subscriber.next(mockResponse);
          console.log(mockResponse);
          subscriber.complete();
        }, 500);
      })
    )
  }
}
