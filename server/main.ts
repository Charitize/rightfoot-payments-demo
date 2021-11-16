import { app } from './app';

/**
 * Get port from environment and store in Express.
 */

const port = 8080;
app.set('port', port);

app.listen(port, () => {
  console.log(`Listening on :${port}`);
});