import { Drawing } from './../db/drawingModel';
import { Request, Response } from 'express';


class DrawingController {
  static async createDrawing(req: Request, res: Response) {
    const { drawingLink, data } = req.body;

    try {
      const newDrawing = new Drawing({
        drawingLink,
        data,
      });
  
      await newDrawing.save();
  
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create drawing' });
    }
  }
  static async getDrawing(req: Request, res: Response) {
    const { drawingLink } = req.params;

  try {
    const drawing = await Drawing.findOne({ drawingLink });

    if (drawing) {
      res.json({ success: true, data: drawing.data });
    } else {
      res.status(404).json({ success: false, error: 'Drawing not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve drawing' });
  }
  }
  
}

export default DrawingController;
