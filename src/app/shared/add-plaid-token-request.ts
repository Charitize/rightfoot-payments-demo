interface AddPlaidTokenBaseRequest {
  plaidPublicToken: string;
}

interface AddPlaidTokenUuidRequest extends AddPlaidTokenBaseRequest {
  uuid: string;
}

interface AddPlaidTokenPlatformIdRequest extends AddPlaidTokenBaseRequest {
  platformId: string;
}

/**
 * This interface describes request body for add plaid token request.
 */
export type AddPlaidTokenRequest = AddPlaidTokenUuidRequest | AddPlaidTokenPlatformIdRequest;
