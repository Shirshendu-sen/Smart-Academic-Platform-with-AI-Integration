import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  quizId:      mongoose.Types.ObjectId;
  studentId:   mongoose.Types.ObjectId;
  score:       number;
  totalQ:      number;
  answers:     Record<string, string>;
  attemptedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId:      { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score:       { type: Number, required: true },
  totalQ:      { type: Number, required: true },
  answers:     { type: Schema.Types.Mixed },
  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
