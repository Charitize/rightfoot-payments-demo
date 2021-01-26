// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment, PlaidEnvironment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://sandbox.api.engineering.rightfoot.com/v1',
  plaid: {
    environment: PlaidEnvironment.SANDBOX,
    publicKey: '1773c898604f2bd4d68ecbbc8504f9'
  },
  personalApiKey: 'SANDBOX-552fde8607de635f6c64f1e3259c0dbb77be93a6cf80af03e13938b1a2a1d572794b8b019abe27a0b20768725d5de7cddfa1e6ad64ac4c88eea2892f825c0458'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
