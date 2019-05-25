import { Model, Document } from 'mongoose';
import { User } from './User';

declare module 'egg' {
  export interface Context {
    model: IModel;
  }
  export interface IModel {
    User: Model<Document & User>;
  }
}
