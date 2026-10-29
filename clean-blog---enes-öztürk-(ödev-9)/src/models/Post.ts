import mongoose from 'mongoose';

/**
 * Ödev 9 - Görev 3:
 * title:String, detail:String, dateCreated:Date(default now)
 * özelliklerine sahip Post modelini oluşturalım.
 */

export interface IPostDocument extends mongoose.Document {
  title: string;
  detail: string;
  author: string;
  dateCreated: Date;
}

const PostSchema = new mongoose.Schema<IPostDocument>({
  title: {
    type: String,
    required: [true, 'Lütfen bir başlık giriniz.'],
    trim: true,
  },
  detail: {
    type: String,
    required: [true, 'Lütfen yazı detayını giriniz.'],
  },
  author: {
    type: String,
    default: 'Enes Öztürk',
    trim: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Post modelini oluşturuyoruz (varsa var olanı kullan, yoksa yenisini derle)
export const Post =
  (mongoose.models.Post as mongoose.Model<IPostDocument>) ||
  mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
