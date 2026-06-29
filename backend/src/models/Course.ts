import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title:        string;
  description?: string;
  instructorId: mongoose.Types.ObjectId;
  thumbnailUrl?: string;
  isPublished:  boolean;
}

const CourseSchema = new Schema<ICourse>({
  title:        { type: String, required: true },
  description:  { type: String },
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnailUrl: { type: String },
  isPublished:  { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
