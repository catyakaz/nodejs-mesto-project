import { Request } from 'express';
import { Schema } from 'mongoose';

export interface IJwtPayload {
  _id: Schema.Types.ObjectId
}

export interface SessionRequest extends Request {
  user?: IJwtPayload;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}
