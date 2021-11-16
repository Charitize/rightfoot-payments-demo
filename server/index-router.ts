import express, { Router } from 'express';

export const router: Router = express.Router();

const environment = {apiUrl: 'https://sandbox.rightfoot.com/v1'}

const CREATE_BENEFICIARY_URL = `${environment.apiUrl}/beneficiaries`;
const ADD_PLAID_TOKEN_URL = `${environment.apiUrl}/beneficiaries/addPlaidToken`;
const PAYMENTS_URL = `${environment.apiUrl}/payments`;

router.get('/healthz', (_req, res) => {
    res.send('OK');
  });