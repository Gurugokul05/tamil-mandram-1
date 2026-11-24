import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
}, { timestamps: true });

export const Event = model('Event', eventSchema);
