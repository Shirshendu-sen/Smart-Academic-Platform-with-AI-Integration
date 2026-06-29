import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId:  mongoose.Types.ObjectId;
  certUrl?:  string;
  issuedAt:  Date;
}

const CertificateSchema = new Schema<ICertificate>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  certUrl:   { type: String },
  issuedAt:  { type: Date, default: Date.now }
});

CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
