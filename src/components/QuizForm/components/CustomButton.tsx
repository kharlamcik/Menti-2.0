'use client';

import { useState, ReactNode } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface CustomButtonProps {
  onClick?: () => void;
  href?: string;
  children: ReactNode;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function CustomButton({
  onClick,
  href,
  children,
  color = "bg-emerald-600",
  hoverColor = "from-emerald-700 to-teal-700",
  textColor = "text-white",
  size = 'md',
  className = "",
  disabled = false,
}: CustomButtonProps) {
  
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple: Ripple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick) onClick();
    if (href) window.location.href = href;
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden font-semibold tracking-wide rounded-2xl
        transition-all duration-300 
        active:scale-[0.97]
        hover:scale-105
        hover:shadow-lg
        ${sizeClasses[size]}
        ${color}
        ${textColor}
        ${className}
      `}
    >
      {/* Плавная смена цвета — теперь hover работает по всей кнопке */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-r ${hoverColor}
          opacity-0 hover:opacity-100 
          transition-opacity duration-300
        `}
      />

      {/* Ripple эффекты */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '25px',
            height: '25px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Содержимое кнопки — поднято выше слоя с цветом */}
      <div className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
        {children}
      </div>
    </button>
  );
}