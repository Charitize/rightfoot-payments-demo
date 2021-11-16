import { Beneficiary } from './beneficiary.interface';

/**
 * This interface describes responses from the public API regarding beneficiaries.
 * E.g. create beneficiary request.
 */
export interface BeneficiaryResponse {
  beneficiary: Beneficiary;
}
