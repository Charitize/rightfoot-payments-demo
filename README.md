# Rightfoot Reference App

This demo reference app exemplifies an application, which provides the
functionality to make payments to users' debt, similar to other payment outlets
like ACH transfers or credit card transfers to another person.

This application has two components:
 * [Angular](https://angular.io) web app, providing an example UI to gather
   required payments information for a beneficiary.
 * [Express.js](https://expressjs.com/) API Server, representing your backend,
   which receives calls from the web app, applies nominal business logic, and 
   then makes authenticated calls to Rightfoot's APIs using
   [Rightfoot's node SDK](https://www.npmjs.com/package/rightfoot-node).
 
An instance of this reference app is hosted at
[demo.rightfoot.com](https://demo.rightfoot.com). 

## Getting Started
This is an Angular and Express.js app, so having some familiarity with the framework is
helpful, it isn't necessarily required.

### Installation
You'll need to be sure [Node.js](https://nodejs.org) is installed with a
version >= 10.

We use yarn for managing dependencies.
[Install yarn](https://classic.yarnpkg.com/en/docs/install) if you haven't
already, and install the dependencies:
```
yarn install
```

Set `RIGHTFOOT_API_KEY` as an environment variable to your Rightfoot API key,
and launch the application server by running `npx ts-node server/main.ts`.
It will start listening on `http://localhost:8080`.

Run `ng serve` to launch a local dev server on port 4200. Navigate to
`http://localhost:4200/`.
