import { Environment, PlaidEnvironment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://sandbox.api.rightfoot.com/v1',
  plaid: {
    environment: PlaidEnvironment.SANDBOX,
    publicKey: '1773c898604f2bd4d68ecbbc8504f9'
  },
  // Sandbox API key for shared demo app. Included in app, since there are no
  // side-effects and the only risk is DDOS, which is mitigated with rate
  // limiting. This should not be included in a production application.
  personalApiKey:
      'SANDBOX-748073dd69fac9d0575729c2f8eb8bbf08eced7c69f490476f0db2d1ae6950' +
      '224597928a93e82271579a92bfcae3d0116a0e416d04b33dd2aa20190d40dc389c'
};
