import { useEffect, useRef, useState } from 'react'

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>("#ffffff");

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)

  const onMouseDown = () => setMouseDown(true)

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawShape = ({ type, size = 20, color = 'black' }: Shape) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const centerX = prevPoint.current?.x || 50; // You can adjust the default coordinates
    const centerY = prevPoint.current?.y || 50; // based on your requirements

    ctx.fillStyle = color;

    switch (type) {
      case 'square':
        ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
        break;
      case 'rectangle':
        ctx.fillRect(centerX - size / 2, centerY - size / 4, size, size / 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size / 2);
        ctx.lineTo(centerX - size / 2, centerY + size / 2);
        ctx.lineTo(centerX + size / 2, centerY + size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      // Add more shapes as needed
      default:
        break;
    }
};
const insertImage = (file: File, width: number, height: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = URL.createObjectURL(file);
  };
const setCanvasBackground = (color: string) => {
    setCanvasBackgroundColor(color);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.backgroundColor = color;
    }
  };

useEffect(() => {
    if (!currentShape) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    drawShape(currentShape);
    setCurrentShape(null); // Reset the shape after drawing
  }, [currentShape, drawShape]);
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return
      const currentPoint = computePointInCanvas(e)

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || !currentPoint) return

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      return { x, y }
    }

    const mouseUpHandler = () => {
      setMouseDown(false)
      prevPoint.current = null
    }

    // Add event listeners
    canvasRef.current?.addEventListener('mousemove', handler)
    window.addEventListener('mouseup', mouseUpHandler)

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [onDraw])

  return { canvasRef, onMouseDown, clear, setCurrentShape, setCanvasBackground, insertImage}
}
