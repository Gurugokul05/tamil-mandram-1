import { Schema, model } from 'mongoose';

const registrationSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qrToken: { type: String, required: true, unique: true },
  status: { type: String, enum: ['registered', 'cancelled', 'attended'], default: 'registered' },
}, { timestamps: true });

registrationSchema.index({ event: 1, user: 1 }, { unique: true });
export const Registration = model('Registration', registrationSchema);
