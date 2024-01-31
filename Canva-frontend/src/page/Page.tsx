

import React, { FC, useRef } from "react";
import { useDraw } from "../hooks/useDraw";
import { ChromePicker, CompactPicker, HuePicker, SketchPicker } from "react-color";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const [color, setColor] = React.useState("black");
  const [fontSize, setFontSize] = React.useState(16);
  const [text, setText] = React.useState("");
  const [shapeSize, setShapeSize] = React.useState(20);
  const [selectedShape, setSelectedShape] = React.useState<'line' | 'text' | 'square' | 'rectangle' | 'triangle'>('line');
  const [backgroundColor, setBackgroundColor] = React.useState("#ffffff"); // Default white
  const [imageWidth, setImageWidth] = React.useState(100); // default width
  const [imageHeight, setImageHeight] = React.useState(100); // default height
  const { canvasRef, onMouseDown, clear, setCurrentShape,setCanvasBackground, insertImage } = useDraw(drawLine);

  const canvasContainerRef = useRef<HTMLDivElement>(null);


  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  const handleTextDraw = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(text, 50, 50); // You can adjust the coordinates as needed
    }
  };
  const handleShapeDraw = () => {
    setCurrentShape({
      type: selectedShape,
      size: shapeSize,
      color: color,
    });
  };
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    setCanvasBackground(color);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      insertImage(file, imageWidth, imageHeight);
    }
  };
  const exportToImage = () => {
    if (!canvasContainerRef.current) return;

    html2canvas(canvasContainerRef.current).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "drawing.png";
      link.click();
    });
  };

  const exportToPDF = () => {
    if (!canvasContainerRef.current) return;

    const pdf = new jsPDF();
    pdf.html(canvasContainerRef.current, {
        callback: (doc) => {
            doc.save("drawing.pdf");
        },
        html2canvas: { scale: 0.3 } // change the scale to whatever number you need
    }
   
    );
  };


  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-3 pr-10 ">
        <CompactPicker color={color} onChange={(e) => setColor(e.hex)} />
        <div className="flex flex-col gap-2 pr-10 border border-black rounded-md justify-center items-center ">
          {selectedShape !== 'text' && (
            <>
              <input
                className="border border-black rounded-md"
                type="number"
                value={shapeSize}
                onChange={(e) => setShapeSize(parseInt(e.target.value))}
              />
              <button
                onClick={handleShapeDraw}
                className="p-4 rounded-md border border-black"
              >
                Draw Shape
              </button>
              <label>
                Select Shape:
                <select
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value as 'line' | 'text' | 'square' | 'rectangle' | 'triangle')}
                >
                  <option value="line">Line</option>
                  <option value="square">Square</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="triangle">Triangle</option>
                </select>
              </label>
            </>
          )}
          </div>
          <div className="flex flex-col gap-2 pr-10 border border-black rounded-md justify-center items-center ">
              <input
                className="border border-black rounded-md"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
              <input
                className="border border-black rounded-md"
                placeholder="Enter Text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={handleTextDraw}
                className="p-4 rounded-md border border-black"
              >
                Draw Text
              </button>
           
        </div>
        <HuePicker
          color={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.hex)}
        />
        <div>

        
        <button
          onClick={exportToImage}
          className="p-4 rounded-md border border-black"
        >
          Export to Image
        </button>
        <button
          onClick={exportToPDF}
          className="p-4 rounded-md border border-black"
        >
          Export to PDF
        </button>
        </div>
        <div className="flex flex-col gap-2 pr-10 border border-black rounded-md justify-center items-center ">
          <label>
            Image Width:
            <input
            
              type="number"
              value={imageWidth}
              onChange={(e) => setImageWidth(parseInt(e.target.value))}
              className="border border-black rounded-md"
            />
          </label>
          <label>
            Image Height:
            <input
              type="number"
              value={imageHeight}
              className="border border-black rounded-md"
              onChange={(e) => setImageHeight(parseInt(e.target.value))}
            />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          onClick={clear}
          className="p-4 rounded-md border border-black"
        >
          Clear Canvas
        </button>
      </div>
      
        <div ref={canvasContainerRef}>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        style={{ backgroundColor: backgroundColor }}
        className="border border-black rounded-md"
      ></canvas>
      </div>
    </div>
  );
};
export default Page;