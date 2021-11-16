import createError from 'http-errors';
import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import path from 'path';

import { router as indexRouter } from './index-router';

export const app: Application = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use(function(err: { status?: number; message?: string}, _req: Request, res: Response, _next: NextFunction) {
  console.error('Failed to load', err);

  res.status(500);
  res.send('Something went wrong.');
});