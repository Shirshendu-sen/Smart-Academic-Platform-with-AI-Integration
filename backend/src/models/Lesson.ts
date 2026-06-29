import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  courseId:   mongoose.Types.ObjectId;
  title:      string;
  content?:   string;
  videoUrl?:  string;
  orderIndex: number;
}

const LessonSchema = new Schema<ILesson>({
  courseId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title:      { type: String, required: true },
  content:    { type: String },
  videoUrl:   { type: String },
  orderIndex: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
