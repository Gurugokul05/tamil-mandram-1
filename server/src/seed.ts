import 'dotenv/config';
import mongoose from 'mongoose';
import { Event } from './models/Event.js';

const events = [
  ['MILIR', 'The journey continues', 'Music, dance, oratory and drama rooted in Tamil tradition.'],
  ['ARAM', 'A tribute to our teachers', 'Games, performances and tokens of appreciation for faculty.'],
  ['MAHATHMA', 'Culture in community', 'A heritage tour with cleanliness drives and community interaction.'],
  ['ROWTHIRAM', 'The fire of Bharathi', 'Poetry, speeches, skits and music celebrating Bharathiyar.'],
  ['PAAVAI VIZHA', 'The voice of devotion', 'Thiruppavai, classical dance, storytelling and poetry.'],
  ['PONGAL', 'A harvest of joy', 'Kolams, uriyadi, folk dance and paraiattam in ethnic wear.'],
  ['TAMIZHI', 'One language, many voices', 'Competitions and recitations for World Mother Tongue Day.'],
  ['VALAM', 'A new year in Tamil', 'Traditional art forms, music, drama and cultural games.'],
].map(([title, subtitle, description], index) => ({ title, subtitle, description, order: index + 1, slug: title.toLowerCase().replaceAll(' ', '-'), status: 'upcoming' }));

await mongoose.connect(process.env.MONGODB_URI ?? '');
await Event.deleteMany({});
await Event.insertMany(events);
console.log(`Seeded ${events.length} signature events.`);
await mongoose.disconnect();
