import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, enum: ['qr', 'coordinator'], default: 'coordinator' },
  attendedAt: { type: Date, default: Date.now },
}, { timestamps: true });

attendanceSchema.index({ event: 1, user: 1 }, { unique: true });
export const Attendance = model('Attendance', attendanceSchema);
