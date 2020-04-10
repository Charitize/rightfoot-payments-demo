import { BeneficiaryRequest } from './beneficiary-request.interface';

/**
 * Interface describes beneficiary object. Based on the public API documentation.
 */
export interface Beneficiary extends BeneficiaryRequest {
  uuid: string;
  paymentsEnabled: boolean;
  socialSecurityNumber: string;
}
