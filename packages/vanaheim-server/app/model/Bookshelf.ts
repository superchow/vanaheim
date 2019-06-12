import { Application } from 'egg';
import { Document, Schema } from 'mongoose';
import { Bookshelf } from 'vanaheim-shared';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const bookShelfSchema = new mongoose.Schema({
    title: { type: Schema.Types.String },
    comicList: { type: [Schema.Types.String] },
    createdAt: { type: Schema.Types.Date, index: true },
    modifiedAt: { type: Schema.Types.Date },
  });
  return mongoose.model<Document & Bookshelf>('BookShelf', bookShelfSchema);
};
