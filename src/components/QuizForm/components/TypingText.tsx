'use client';

import { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;                    // основной текст (обязательно)
  speed?: number;                  // скорость печати (мс)
  deleteSpeed?: number;            // скорость стирания (мс)
  delay?: number;                  // пауза перед стиранием (мс)
  loop?: boolean;                  // зацикливать (печать → стирание → печать)
  className?: string;
  showCursor?: boolean;
}

export default function TypingText({
  text,
  speed = 50,
  deleteSpeed = 30,
  delay = 1500,
  loop = false,
  className = "text-gray-300",
  showCursor = true,
}: TypingTextProps) {
  
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // === РЕЖИМ ПЕЧАТИ ===
      if (currentIndex < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);
      } 
      else if (loop) {
        // Закончили печатать → ждём и начинаем стирать
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    } 
    else {
      // === РЕЖИМ СТИРАНИЯ ===
      if (currentIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        }, deleteSpeed);
      } 
      else {
        // Полностью стёрли → начинаем печатать заново
        setIsDeleting(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, deleteSpeed, delay, loop]);

  return (
    <p className={`inline-flex items-center ${className}`}>
      {displayedText}
      {showCursor && (
        <span className="ml-1 animate-pulse text-gray-400"></span>
      )}
    </p>
  );
}