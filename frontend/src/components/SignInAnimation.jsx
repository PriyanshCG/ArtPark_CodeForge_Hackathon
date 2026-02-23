import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SignInAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const rings = [340, 290, 240, 190, 140, 90, 42];

  const styles = `
    @keyframes outerRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes morph {
      0% { border-radius: 50%; }
      33% { border-radius: 30%; }
      66% { border-radius: 10% 40% 10% 40%; }
      100% { border-radius: 40% 10% 40% 10%; }
    }

    @keyframes ringSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes orbPulse {
      0% { 
        transform: scale(1);
        box-shadow: 0 0 12px 4px rgba(196, 181, 253, 0.8), 0 0 28px 10px rgba(99, 102, 241, 0.5);
      }
      100% { 
        transform: scale(1.5);
        box-shadow: 0 0 24px 8px rgba(196, 181, 253, 1), 0 0 48px 20px rgba(99, 102, 241, 0.7);
      }
    }

    @keyframes labelSpinner {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .animation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 44, 0.96);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .wrapper {
      position: relative;
      width: 400px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: outerRotate 5s linear infinite;
    }

    .ring {
      position: absolute;
      border: 3px solid transparent;
      box-sizing: border-box;
      animation: morph 2s ease-in-out alternate infinite;
    }

    .ring-inner-spin {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      animation: ringSpin linear infinite;
    }

    .orb {
      position: absolute;
      width: 22px;
      height: 22px;
      background: radial-gradient(circle, #ffffff, #c4b5fd, #6366f1);
      border-radius: 50%;
      z-index: 100;
      animation: orbPulse 1.2s ease-in-out alternate infinite;
    }

    .label-container {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: labelSpinner 0.8s linear infinite;
    }

    .signing-text {
      color: #c5d0f5;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
  `;

  return createPortal(
    <div className="animation-overlay">
      <style>{styles}</style>

      <div className="wrapper">
        {rings.map((size, i) => {
          const rotationOffset = i * 51;
          const delay = i * 0.18;
          const spinDuration = 3 + i * 0.5; // Staggered spin duration

          return (
            <div
              key={i}
              className="ring"
              style={{
                width: size,
                height: size,
                animationDelay: `${delay}s`,
                animationDuration: `2s, ${spinDuration}s`,
                animationName: 'morph, ringSpin',
                backgroundImage: `linear-gradient(rgba(10, 15, 44, 0.96), rgba(10, 15, 44, 0.96)), conic-gradient(from ${rotationOffset}deg, #3a3fd4, #d4c5f0, #6366f1, #a78bfa, #3a3fd4)`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                boxShadow: `0 0 18px 4px rgba(99, 102, 241, ${0.5 - i * 0.05})`,
              }}
            />
          );
        })}

        <div className="orb" />
      </div>

      <div className="label-container">
        <div className="spinner" />
        <span className="signing-text">Signing in…</span>
      </div>
    </div>,
    document.body
  );
};

export default SignInAnimation;
