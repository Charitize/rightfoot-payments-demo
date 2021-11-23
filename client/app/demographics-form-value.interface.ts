import { CreateBeneficiaryRequest } from 'rightfoot-node/1-3/api';

/**
 * This interface corresponds to demographics form group's value.
 */
// TODO(willjschmitt): Unify form value to be entirely CreateBeneficiaryRequest.
export type DemographicsFormValue = Omit<CreateBeneficiaryRequest, 'dateOfBirth'> & { dateOfBirth: Date; };
