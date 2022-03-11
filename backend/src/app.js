import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { publicRoutes } from './routes';
import { httpLogger, errorHandler } from './middleware';
import { web3Service } from './services';

const app = express();

// http logger
app.use(httpLogger);

// allow cross origin requests
app.use(cors());

// parsing request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.use('/', publicRoutes);

web3Service().syncBidEvents();

// error handling
app.use(errorHandler);

export default app;
