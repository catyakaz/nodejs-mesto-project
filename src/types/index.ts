import { Request } from 'express';
import { Schema } from 'mongoose';

export interface SessionRequest extends Request {
  user?: { _id: Schema.Types.ObjectId };
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}
