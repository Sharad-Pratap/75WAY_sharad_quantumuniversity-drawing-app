import mongoose from 'mongoose';
const drawingSchema = new mongoose.Schema({
  drawingLink: { type: String, unique: true },
  data: Object,
});

export const Drawing = mongoose.model('Drawing', drawingSchema);