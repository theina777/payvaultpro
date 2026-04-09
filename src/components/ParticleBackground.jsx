import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 40) + 5;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
      
      update() {
        // Handle mouse gravity/repulsion
        let dx = Object.is(mouse.x, null) ? 0 : mouse.x - this.x;
        let dy = Object.is(mouse.y, null) ? 0 : mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && mouse.x !== null) {
          // Repel outward
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Spring back with elasticity
          if (this.x !== this.baseX) {
            let dxReturn = this.x - this.baseX;
            this.x -= dxReturn / 15;
          }
          if (this.y !== this.baseY) {
            let dyReturn = this.y - this.baseY;
            this.y -= dyReturn / 15;
          }
        }

        // Constant gentle background drift
        this.baseX += this.dx;
        this.baseY += this.dy;

        // Wrap around seamlessly
        if (this.baseX > canvas.width + this.size) { this.baseX = -this.size; this.x = this.baseX; }
        if (this.baseX < 0 - this.size) { this.baseX = canvas.width + this.size; this.x = this.baseX; }
        if (this.baseY > canvas.height + this.size) { this.baseY = -this.size; this.y = this.baseY; }
        if (this.baseY < 0 - this.size) { this.baseY = canvas.height + this.size; this.y = this.baseY; }

        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 7000);
      
      const colors = [
        'rgba(59, 130, 246, 0.8)', // accent
        'rgba(96, 165, 250, 0.6)', // light glow
        'rgba(148, 163, 184, 0.4)',// subdued grey
        'rgba(30, 64, 175, 0.8)'   // deep blue
      ];

      for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() - 0.5) * 0.4;
        let dy = (Math.random() - 0.5) * 0.4;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="hide-on-print"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
