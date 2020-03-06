import { Environment, PlaidEnvironment } from './environment.interface';

export const environment: Environment = {
  production: true,
  // TODO: change to real API URL.
  apiUrl: 'localhost:9000',
  plaid: {
    environment: PlaidEnvironment.PRODUCTION,
    publicKey: '1773c898604f2bd4d68ecbbc8504f9'
  }
};
