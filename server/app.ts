import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import { Application, Request, Response, NextFunction } from 'express';
import path from 'path';

import { ApiRouter } from './api-router';

/**
 * Bootrapping of an Application server in express.
 *
 * Demonstrates a simple example application using express that a customer
 * might create for their front end to communicate with and then to communicate
 * with Rightfoot's APIs.
 */
export class App {
  private readonly _app: express;

  constructor(apiRouter: ApiRouter, exp: express) {
    this._app = exp();

    // This is an API server, so we expect cross-origin requests.
    this._app.use(cors());

    // View engine setup.
    this._app.set('views', path.join(__dirname, 'views'));
    this._app.set('view engine', 'hbs');

    this._app.use(express.json());
    this._app.use(express.urlencoded({extended: false}));
    this._app.use(express.static(path.join(__dirname, 'public')));

    /** Health check. */
    this._app.get('/healthz', (req: any, res: any) => {
      res.send('OK');
    });

    this._app.use('/api', apiRouter.router);

    // Catch 404 and forward to error handler.
    this._app.use((_req, _res, next: NextFunction) => {
      next(createError(404));
    });

    // Generic error handler implementation.
    this._app.use((err: { status?: number; message?: string }, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Failed to load', err);

      res.status(500);
      res.send('Something went wrong.');
    });
  }

  /** The express application created. */
  public get app(): Application {
    return this._app;
  }
}
