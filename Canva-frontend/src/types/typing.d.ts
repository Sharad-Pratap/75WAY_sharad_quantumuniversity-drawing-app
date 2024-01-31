type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
  }
  
  type Point = { x: number; y: number }
  type Shape = {
    type: 'line' | 'text' | 'square' | 'rectangle' | 'triangle'; // Add shape types
    size: number;
    color: string;
  };