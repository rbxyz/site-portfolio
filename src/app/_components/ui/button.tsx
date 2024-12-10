// src/app/_components/ui/button.tsx
import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: string;  // Você pode definir variantes de estilo, se necessário
  size: string;     // Defina os tamanhos para o botão
  ariaLabel: string;  // Para acessibilidade
}

export const Button = ({
  onClick,
  children,
  variant,
  size,
  ariaLabel,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn ${variant} ${size}`}
    >
      {children}
    </button>
  );
};
