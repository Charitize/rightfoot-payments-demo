import { BeneficiaryRequestInterface } from './beneficiary-request.interface';

export interface BeneficiaryInterface extends BeneficiaryRequestInterface {
  uuid: string;
  paymentsEnabled: boolean;
}
