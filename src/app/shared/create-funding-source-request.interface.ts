/**
 * This interface describes request body for funding source creation request.
 */
export interface CreateFundingSourceRequest {
  beneficiaryUuid: string;
  plaidPublicToken: string;
}
