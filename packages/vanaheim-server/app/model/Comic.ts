import { Application } from 'egg';
import { Document, Schema } from 'mongoose';

/**
 * 用户模型
 */

export interface Comic {
  name: string;
  title: string;
  titleOriginal: string;
  coverUrl: string;
  fileSize: number;
  read: boolean;
  parody: string;
  group: string;
  artist: string;
}

export default (app: Application) => {
  const mongoose = app.mongoose;
  const userSchema = new mongoose.Schema({
    name: { type: Schema.Types.String },
    title: { type: Schema.Types.String },
    titleOriginal: { type: Schema.Types.String },
    coverUrl: { type: Schema.Types.String },
    fileSize: { type: Schema.Types.String },
    read: { type: Schema.Types.Boolean },
    parody: { type: Schema.Types.Boolean },
    group: { type: Schema.Types.Boolean },
    artist: { type: Schema.Types.Boolean },
  });
  return mongoose.model<Document & Comic>('Comic', userSchema);
};
