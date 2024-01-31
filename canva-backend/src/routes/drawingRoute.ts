import express from 'express';
import DrawingController from '../controller/drawingController';

const router = express.Router();

router.post('/api/createDrawing', DrawingController.createDrawing);
router.get('/api/getDrawing/:drawingLink', DrawingController.getDrawing);
// ... other routes remain unchanged

export default router;
