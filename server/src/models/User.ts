import { Schema, model } from 'mongoose';

export const roles = ['member', 'student_coordinator', 'president', 'faculty_coordinator'] as const;
export type Role = typeof roles[number];

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  regNo: { type: String, required: true, unique: true, index: true, uppercase: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: roles, default: 'member' },
  applicationStatus: { type: String, enum: ['pending_president', 'pending_faculty', 'approved', 'rejected'], default: 'pending_president' },
  rejectionReason: { type: String },
  tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });

export const User = model('User', userSchema);
