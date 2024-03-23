import React, { useEffect } from "react";
import { useCallback, useRef, useState } from "react";

import canvasInit from "./Canvas";

function App() {
  useEffect(() => {
    canvasInit();
  }, []);

  const canvas = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handlerMoveMouse = useCallback((e: MouseEvent) => {
    if (canvas.current && colorPicker.current) {
      const rect = colorPicker.current.getBoundingClientRect();
      if (!colorPicker.current.classList.contains("active")) setPos({ x: e.x - rect.x / 2, y: e.y - rect.y / 2 });
    }
  }, []);

  useEffect(() => {
    const _ref = canvas.current;
    _ref?.addEventListener("mousemove", handlerMoveMouse);
    return () => {
      _ref?.removeEventListener("mousemove", handlerMoveMouse);
    };
  }, [handlerMoveMouse]);

  return (
    <div className="App">
      <div ref={colorPicker} id="color-picker" className="" style={{ left: pos.x, top: pos.y }}>
        <input type="color" />
      </div>
      <canvas ref={canvas} id="the-canvas" width="550" height="550"></canvas>
    </div>
  );
}

export default App;
