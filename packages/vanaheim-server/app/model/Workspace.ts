import { Application } from 'egg';
import { Document, Schema } from 'mongoose';

export interface Workspace {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  modifiedAt: string;
}

export default (app: Application) => {
  const mongoose = app.mongoose;
  const workspaceSchema = new mongoose.Schema({
    name: { type: Schema.Types.String },
    path: { type: Schema.Types.String },
    createdAt: { type: Schema.Types.Date },
    modifiedAt: { type: Schema.Types.Date },
  });
  return mongoose.model<Document & Workspace>('Workspace', workspaceSchema);
};
