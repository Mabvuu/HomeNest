import React, { useRef, useEffect } from 'react';

export default function BackgroundNest() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // Define a house frame centered on screen
    const houseWidth  = 200;
    const houseHeight = 150;
    const cx = w / 2;
    const cy = h / 2 + 50;

    // Four wall segments and two roof segments
    const segments = [
      // bottom wall
      { x1: cx - houseWidth/2, y1: cy + houseHeight/2,
        x2: cx + houseWidth/2, y2: cy + houseHeight/2 },
      // right wall
      { x1: cx + houseWidth/2, y1: cy + houseHeight/2,
        x2: cx + houseWidth/2, y2: cy - houseHeight/2 },
      // top wall
      { x1: cx + houseWidth/2, y1: cy - houseHeight/2,
        x2: cx - houseWidth/2, y2: cy - houseHeight/2 },
      // left wall
      { x1: cx - houseWidth/2, y1: cy - houseHeight/2,
        x2: cx - houseWidth/2, y2: cy + houseHeight/2 },
      // roof right
      { x1: cx, y1: cy - houseHeight/2 - 80,
        x2: cx + houseWidth/2, y2: cy - houseHeight/2 },
      // roof left
      { x1: cx - houseWidth/2, y1: cy - houseHeight/2,
        x2: cx, y2: cy - houseHeight/2 - 80 },
    ];

    // Create twigs that grow along those segments
    const twigs = segments.flatMap(seg => {
      // generate ~50 twigs per segment
      return Array.from({ length: 50 }, () => {
        // pick a random point along the segment
        const t = Math.random();
        const x = seg.x1 + (seg.x2 - seg.x1) * t;
        const y = seg.y1 + (seg.y2 - seg.y1) * t;
        // angle roughly along the segment, plus a bit of randomness
        const baseAngle = Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1);
        const angle = baseAngle + (Math.random() - 0.5) * Math.PI / 3;
        return {
          x, y,
          angle,
          len:    0,
          target: 10 + Math.random() * 20, // twigs 10–30px
        };
      });
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#8faeff';
      ctx.lineWidth   = 2;

      twigs.forEach(t => {
        if (t.len < t.target) t.len += 1;
        const x2 = t.x + Math.cos(t.angle) * t.len;
        const y2 = t.y + Math.sin(t.angle) * t.len;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        width:          '100%',
        height:         '100%',
        zIndex:         0,
        pointerEvents: 'none'
      }}
    />
  );
}
