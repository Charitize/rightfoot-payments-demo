import { Environment, PlaidEnvironment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://sandbox.api.rightfoot.com/v1',
  plaid: {
    environment: PlaidEnvironment.SANDBOX,
    publicKey: '1773c898604f2bd4d68ecbbc8504f9'
  },
  personalApiKey: 'secure-private-key'
};
