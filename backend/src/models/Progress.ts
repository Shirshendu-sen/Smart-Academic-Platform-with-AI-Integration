import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  studentId:    mongoose.Types.ObjectId;
  lessonId:     mongoose.Types.ObjectId;
  completed:    boolean;
  completedAt?: Date;
}

const ProgressSchema = new Schema<IProgress>({
  studentId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  lessonId:    { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date }
});

ProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
