/**
 * Interface all environment files should implement.
 */

export interface Environment {
  production: boolean;

  /** Plaid Link config for linking loan accounts. */
  plaid: PlaidConfiguration;

  /**
   * Base URL for all API requests.
   */
  apiUrl: string;
}


/**
 * Plaid supports more deployment environments, but in this app we will use only sandbox.
 */
export enum PlaidEnvironment {
  /**
   * Sandbox uses the same fake credentials for all institutions to create a
   * mocked environment.
   */
  SANDBOX = 'sandbox',
}

/**
 * Configuration for the Plaid frontend client (plaid-link).
 */
export interface PlaidConfiguration {
  /** Environment for which Plaid is deployed. */
  environment: PlaidEnvironment;

  /** Public Key to identify thi platform. */
  publicKey: string;
}
