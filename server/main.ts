/**
 * Entry point script for Application server.
 *
 * Starts a server that receives requests from client/frontend, applying basic
 * business logic making requests to the Rightfoot public API.
 *
 * Environment variables supported:
 *  * `RIGHTFOOT_API_KEY`: Required. The API key used to authenticate with Rightfoot.
 *  * `RIGHTFOOT_API_HOST`: The Rightfoot endpoint to make requests to.
 *        Defaults to the Sandbox endpoint.
 *  * `PORT`: The port for the server to listen on. Defaults to 8080.
 */
import express from 'express';
import { RightfootApi } from 'rightfoot-node/1-3/api';
import { Configuration } from 'rightfoot-node/1-3/configuration';

import { App } from './app';
import { ApiRouteHandlers } from './api-route-handlers';
import { ApiRouter } from './api-router';

/**
 * Creates a Rightfoot API client from environment variables set.
 */
function createRightfootClient(): RightfootApi {
  const apiKey: string | undefined = process.env.RIGHTFOOT_API_KEY;
  if (apiKey === undefined) {
    throw new Error('RIGHTFOOT_API_KEY must be set');
  }
  const config: Configuration = new Configuration({
    apiKey: `Bearer ${apiKey}`,
  });
  const rightfootApiHost = process.env.RIGHTFOOT_API_HOST || 'https://sandbox.api.rightfoot.com/v1';
  return new RightfootApi(config, rightfootApiHost);
}

/**
 * Creates an express app and binds it to the requested port.
 *
 * Blocks until application exits.
 *
 * @param rightfootClient Rightfoot API client to communicate with.
 */
function createAndStartApp(rightfootClient: RightfootApi) {
  const apiRouter = new ApiRouter(express, new ApiRouteHandlers(rightfootClient));

  const app: express = new App(apiRouter, express).app;

  const port = process.env.PORT || 8080;
  app.set('port', port);

  app.listen(port, () => {
    console.log(`Listening on :${port}`);
  });
}

/**
 * Creates and wires dependencies for app, starting it.
 *
 * Blocks until application exits.
 */
function main() {
  const rightfootClient: RightfootApi = createRightfootClient();

  createAndStartApp(rightfootClient);
}

main();
