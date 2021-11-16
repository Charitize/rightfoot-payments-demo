interface CreatePaymentBaseRequest {
  paymentAmount: number;
  paymentDate?: string;
}

interface CreatePaymentUuidRequest extends CreatePaymentBaseRequest {
  beneficiaryUuid: string;
}

interface CreatePaymentPlatformIdRequest extends CreatePaymentBaseRequest {
  beneficiaryPlatformId: string;
}

/**
 * This interface describes request body for payment creation request.
 */
export type CreatePaymentRequest = CreatePaymentPlatformIdRequest | CreatePaymentUuidRequest;
