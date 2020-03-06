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
 * Three deployment environments a single public client key can represent.
 */
export enum PlaidEnvironment {
  /** Development supports up to 100 real accounts. */
  DEVELOPMENT = 'development',

  /**
   * Sandbox uses the same fake credentials for all institutions to create a
   * mocked environment.
   */
  SANDBOX = 'sandbox',

  /**
   * Live data environment used only for the actual application.
   */
  PRODUCTION = 'production',
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
