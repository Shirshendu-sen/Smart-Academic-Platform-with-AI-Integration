import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name:      string;
  email:     string;
  password:  string;
  role:      'student' | 'instructor' | 'admin';
  avatarUrl?: string;
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role: {
    type:    String,
    enum:    ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatarUrl: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
