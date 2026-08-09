import React, { useEffect, useRef } from 'react';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas AI particle mesh animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 1,
      color: Math.random() > 0.5 ? '#00F0FF' : '#0066FF'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0F1D36');
      bgGrad.addColorStop(0.5, '#090E1A');
      bgGrad.addColorStop(1, '#05070E');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Auto dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontFamily: 'var(--font-main)',
      userSelect: 'none'
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '30px',
        maxWidth: '540px'
      }}>
        {/* Animated Emblem */}
        <img
          src="/csjm_logo.png"
          alt="CSJMU Logo"
          style={{
            width: '130px',
            height: '130px',
            objectFit: 'contain',
            marginBottom: '24px',
            animation: 'floatAnim 3s ease-in-out infinite'
          }}
        />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(0, 102, 255, 0.25)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#00F0FF',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} />
          Chhatrapati Shahu Ji Maharaj University, Kanpur
        </div>

        {/* Main Title */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '38px',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #00F0FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          CSJMU AI SUMMIT 2026
        </h1>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#00F0FF',
          marginBottom: '12px',
          letterSpacing: '0.02em'
        }}>
          CSJMU Smart Auditorium
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '15px',
          color: '#94A3B8',
          marginBottom: '32px',
          fontWeight: 400
        }}>
          Your AI Event & Indoor Navigation Companion
        </p>

        {/* Progress Bar & Skip */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          maxWidth: '300px'
        }}>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #0066FF 0%, #00F0FF 100%)',
              borderRadius: '10px',
              animation: 'loadProgress 2.5s ease-in-out forwards'
            }} />
          </div>

          <button
            onClick={onFinish}
            className="btn-glass"
            style={{
              fontSize: '13px',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Enter Dashboard <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes loadProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
