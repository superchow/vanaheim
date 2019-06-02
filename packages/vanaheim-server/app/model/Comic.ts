import { Application } from 'egg';
import { Document, Schema } from 'mongoose';
import { Comic } from 'vanaheim-shared';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const comicSchema = new mongoose.Schema({
    title: { type: Schema.Types.String },
    titleOriginal: { type: Schema.Types.String },
    cover: { type: Schema.Types.String },
    group: { type: Schema.Types.String },
    parody: { type: Schema.Types.Array },
    tags: { type: Schema.Types.Array },
    read: { type: Schema.Types.Boolean },
    artist: { type: Schema.Types.String },
    fileSize: { type: Schema.Types.Number },
    createdAt: { type: Schema.Types.Date },
    modifiedAt: { type: Schema.Types.Date },
  });
  return mongoose.model<Document & Comic>('Comic', comicSchema);
};
