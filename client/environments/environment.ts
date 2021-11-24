// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment, PlaidEnvironment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  plaid: {
    environment: PlaidEnvironment.SANDBOX,
    publicKey: '1773c898604f2bd4d68ecbbc8504f9'
  },
  personalApiKey: 'SANDBOX-ea6dba36ce97d30b4593afb7785d7b1c301a461771eb1acc9e4e9ad413eaf41e91f5ce44649185b7e47eba3fc98bfaa5d51dd4b8c13c90b1368457c63399e574'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
