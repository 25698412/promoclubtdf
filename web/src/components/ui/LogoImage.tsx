'use client';

interface LogoImageProps {
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  fallbackBg?: string;
}

export const LogoImage = ({
  className = 'w-8 h-8 object-contain',
  fallbackText = 'PC',
  fallbackBg = 'linear-gradient(135deg, #1B3A5C, #2E6B8A)',
}: LogoImageProps) => {
  return (
    <img
      src="/logo.png"
      alt="Promo Club TDF"
      className={className}
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = 'none';
        const parent = el.parentElement;
        if (parent) {
          parent.style.background = fallbackBg;
          parent.innerHTML = `<span style="color:white;font-weight:700;font-size:12px">${fallbackText}</span>`;
        }
      }}
    />
  );
};

export default LogoImage;
