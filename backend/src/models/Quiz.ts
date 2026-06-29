import mongoose, { Document, Schema } from 'mongoose';

const QuestionSchema = new Schema({
  question:       { type: String, required: true },
  options:        { type: [String], required: true },
  correct_answer: { type: String, required: true },
  explanation:    { type: String }
}, { _id: false });

export interface IQuizQuestion {
  question:       string;
  options:        string[];
  correct_answer: string;
  explanation?:   string;
}

export interface IQuiz extends Document {
  lessonId:  mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
}

const QuizSchema = new Schema<IQuiz>({
  lessonId:  { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true },
  questions: { type: [QuestionSchema], required: true }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
