import express, { Router } from 'express';
import { ApiRouteHandlers } from './api-route-handlers';

/**
 * The Express router for handling API requests.
 *
 * Routes URLs to the route handler.
 */
export class ApiRouter {
  private _router: Router;

  constructor(exp: express, routeHander: ApiRouteHandlers) {
    this._router = exp.Router();

    /** Creates a new beneficiary. */
    this._router.post('/beneficiaries', (req, resp) => routeHander.createBeneficiary(req, resp));

    /** Connects Plaid Public Token with a beneficiary. */
    this._router.post('/beneficiaries/addPlaidToken', (req, resp) => routeHander.addPlaidToken(req, resp));

    /**
     * Issues a request to transfer funds from the funding source to the
     * beneficiary's loan account.
     */
    this._router.post('/payments', (req, resp) => routeHander.createPayment(req, resp));

    /**
     * This request retrieves an existing payment, updated with the latest status
     * of its processing along with error information.
     */
    this._router.get('/payments/:uuid', (req, resp) => routeHander.getPayment(req, resp));
  }

  /** The express router that can be attached to an express app. */
  get router(): express.Router {
    return this._router;
  }
}
