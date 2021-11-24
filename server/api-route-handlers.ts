import {
  AddCreditCardToBeneficiaryRequest, AddCreditCardToBeneficiaryResponse,
  AddPlaidTokenToBeneficiaryRequest,
  AddPlaidTokenToBeneficiaryResponse, Beneficiary,
  CreateBeneficiaryRequest,
  CreateBeneficiaryResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  Loan,
  RightfootApi
} from 'rightfoot-node/1-3/api';

import { Request, Response } from 'express';

/**
 * Handlers for the Application server routes.
 *
 * Communicates with Rightfoot Public API.
 */
export class ApiRouteHandlers {
  constructor(private service: RightfootApi) {}

  /**
   * Creates a beneficiary at Rightfoot.
   *
   * This will be used to associate loans with.
   *
   * @param req Application server request with information needed to create a Beneficiary.
   * @param res Response with the `Beneficiary` if successfully created.
   */
  public async createBeneficiary(
      req: Request<CreateBeneficiaryRequest>, res: Response<Beneficiary>) {
    try {
      const createBeneficiaryRequest: CreateBeneficiaryRequest = req.body;
      const createBeneficiaryResponse: CreateBeneficiaryResponse =
        await this.service.createBeneficiary(createBeneficiaryRequest);
      res.send(createBeneficiaryResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating Beneficiary.');
    }
  }

  /**
   * Associates `Loan`s with a `Beneficiary` with a public token created by Plaid.
   *
   * @param req Application server request with the Plaid public token.
   * @param res Response with the updated `Beneficiary`.
   */
  public async addPlaidToken(
      req: Request<AddPlaidTokenToBeneficiaryRequest & { uuid: string; }>,
      res: Response<AddPlaidTokenToBeneficiaryResponse>) {
    try {
      const addPlaidPublicTokenRequest: AddPlaidTokenToBeneficiaryRequest = req.body;
      const addPlaidTokenToBeneficiaryResponse: AddPlaidTokenToBeneficiaryResponse =
        await this.service.addPlaidTokenToBeneficiary(addPlaidPublicTokenRequest, req.body.uuid);
      res.send(addPlaidTokenToBeneficiaryResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding Plaid token to Beneficiary.');
    }
  }

  /**
   * Associates `Loan`s with a `Beneficiary` with credit card information.
   *
   * @param req Application server request with the credit card info.
   * @param res Response with the created `Loan`.
   */
  public async addCreditCard(
    req: Request<AddCreditCardToBeneficiaryRequest>,
    res: Response<Loan>) {
    try {
      const addCreditCardToBeneficiaryRequest: AddCreditCardToBeneficiaryRequest = req.body;
      const addCreditCardToBeneficiaryResponse: AddCreditCardToBeneficiaryResponse =
        await this.service.addCreditCardToBeneficiary(addCreditCardToBeneficiaryRequest, req.params.uuid);
      res.send(addCreditCardToBeneficiaryResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding credit card to Beneficiary.');
    }
  }

  /**
   * Creates a `Payment` for a `Loan` at Rightfoot.
   *
   * @param req Application server request with the payment details to create.
   * @param res Response with the `Payment` if successfulyl created.
   */
  public async createPayment(
      req: Request<CreatePaymentRequest>, res: Response<CreatePaymentResponse>) {
    try {
      const createPaymentRequest: CreatePaymentRequest = req.body;
      const createPaymentResponse: CreatePaymentResponse =
        await this.service.createPayment(createPaymentRequest);
      res.send(createPaymentResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating Payment.');
    }
  }

  /**
   * Checks the status of a `Payment`
   *
   * @param req Application server request to retrieve a payment.
   * @param res Response with the `Payment` retrieved.
   */
  public async getPayment(
      req: Request<CreatePaymentRequest>, res: Response<CreatePaymentResponse>) {
    try {
      const paymentUuid: string = req.params.uuid;
      const response: CreatePaymentResponse = await this.service.getPayment(paymentUuid);
      res.send(response);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting Payment.');
    }
  }
}
