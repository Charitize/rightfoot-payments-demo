import { BeneficiaryRequest } from './beneficiary-request.interface';

export interface Beneficiary extends BeneficiaryRequest {
  uuid: string;
  paymentsEnabled: boolean;
}
