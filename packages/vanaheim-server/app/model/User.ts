import { Application } from 'egg';
import { Document, Schema } from 'mongoose';

/**
 * 用户模型
 */

export interface User {
  realName: string;
  nickName: string;
}

export default (app: Application) => {
  const mongoose = app.mongoose;
  const userSchema = new mongoose.Schema({
    realName: { type: Schema.Types.String },
    nickName: { type: Schema.Types.String },
  });
  return mongoose.model<Document & User>('User', userSchema);
};
