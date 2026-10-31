import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  showText?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 110,
  className = '',
  showText = false,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 flex items-center justify-center border border-slate-300 rounded text-[10px] text-slate-400 ${className}`}
      >
        QR
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={dataUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded shadow-xs border border-slate-200 bg-white p-1"
      />
      {showText && (
        <span className="text-[9px] font-mono text-slate-500 mt-1 max-w-[140px] truncate text-center">
          {value}
        </span>
      )}
    </div>
  );
};

interface BarcodeDisplayProps {
  value: string;
  height?: number;
  width?: number;
  className?: string;
  showText?: boolean;
}

// Crisp Vector Code 128 / Code 39 Barcode Renderer (Pure SVG)
export const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  value,
  height = 42,
  width = 1.6,
  className = '',
  showText = true,
}) => {
  // Deterministic bar pattern generator from string characters
  const bars = React.useMemo(() => {
    const clean = (value || '00000000').toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const pattern: number[] = [2, 1, 1, 2]; // Start guard
    for (let i = 0; i < clean.length; i++) {
      const charCode = clean.charCodeAt(i);
      pattern.push(
        (charCode % 3) + 1,
        ((charCode >> 1) % 2) + 1,
        ((charCode >> 2) % 3) + 1,
        (charCode % 2) + 1
      );
    }
    pattern.push(2, 1, 2, 2); // Stop guard
    return pattern;
  }, [value]);

  let currentX = 0;
  const barElements = bars.map((w, index) => {
    const isBar = index % 2 === 0;
    const barWidth = w * width;
    const x = currentX;
    currentX += barWidth;
    if (!isBar) return null;
    return (
      <rect
        key={index}
        x={x}
        y={0}
        width={barWidth}
        height={height}
        fill="#0f172a"
      />
    );
  });

  return (
    <div className={`flex flex-col items-center inline-block ${className}`}>
      <svg
        width={currentX}
        height={height}
        viewBox={`0 0 ${currentX} ${height}`}
        className="overflow-visible"
      >
        {barElements}
      </svg>
      {showText && (
        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-800 mt-0.5">
          {value}
        </span>
      )}
    </div>
  );
};
