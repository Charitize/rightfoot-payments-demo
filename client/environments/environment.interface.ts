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

  /**
   * The key which is used as an Authorization header for Rightfoot Public API
   * requests.
   */
  personalApiKey: string;

  /**
   * The vault ID used by VGS Collect (the UI element used to capture credit card
   * numbers).
   */
  vgs: VGSConfiguration;
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

/**
 * Use only the sandbox environment for testing.
 */
export enum VGSEnvironment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

/**
 * Configuration for the VGS vault being used with VGS Collect.
 */
export interface VGSConfiguration {
  /** ID that indicates which VGS vault to use for credit card tokenization. */
  vaultId: string;

  /** The VGS environment being used for credit card tokenization. */
  environment: VGSEnvironment;
}
