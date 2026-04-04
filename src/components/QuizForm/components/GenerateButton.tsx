'use client';

import { useState } from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  text?: string;
  loadingText?: string;
  color?: string;        // цвет кнопки в обычном состоянии
  hoverColor?: string;   // цвет при наведении (по желанию)
  textColor?: string;
  className?: string;
}

export default function GenerateButton({
  onClick,
  loading = false,
  text = "Сгенерировать викторину",
  loadingText = "Генерируем вопросы...",
  color = "bg-gradient-to-r from-indigo-600 to-violet-600",
  hoverColor = "from-purple-600 to-indigo-600",
  textColor = "text-white",
  className = "",
}: GenerateButtonProps) {
  
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
      disabled={loading}
      className={`
        relative w-full py-5 px-8 rounded-3xl overflow-hidden font-semibold text-lg
        transition-all duration-300 active:scale-[0.97]
        ${color} ${textColor} ${className}
        group
      `}
      style={{
        background: color.includes('gradient') 
          ? undefined 
          : color.replace('bg-', '')
      }}
    >
      {/* Заливка от центра при hover */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl
        bg-gradient-to-r ${hoverColor}
        scale-90 group-hover:scale-100
      `} />

      {/* Ripple эффекты */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/25 rounded-full pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '25px',
            height: '25px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Содержимое кнопки */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="tracking-wide">{loadingText}</span>
          </>
        ) : (
          <>
            <span className="text-2xl transition-transform group-hover:scale-110 duration-300">
              ✨
            </span>
            <span className="tracking-wide">{text}</span>
          </>
        )}
      </div>
    </button>
  );
}