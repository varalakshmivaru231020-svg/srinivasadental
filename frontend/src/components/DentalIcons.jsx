// Custom dental line icons (Lucide has no tooth icons). Same props as Lucide icons: size, strokeWidth, className.

const TOOTH = 'M7.5 3C5 3 3.5 4.9 3.5 7.3c0 2.1.8 3.6 1.5 5.1.6 1.3.9 2.7 1.1 4.2.3 2 .7 4.4 2 4.4 1.4 0 1.6-2.4 2-4 .2-.9.7-1.4 1.9-1.4s1.7.5 1.9 1.4c.4 1.6.6 4 2 4 1.3 0 1.7-2.4 2-4.4.2-1.5.5-2.9 1.1-4.2.7-1.5 1.5-3 1.5-5.1C20.5 4.9 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z';

function Svg({ size = 24, strokeWidth = 1.8, className, children, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Tooth = (p) => <Svg {...p}><path d={TOOTH} /></Svg>;

export const ToothImplant = (p) => (
  <Svg {...p}>
    <path d="M7.5 2.5C5 2.5 3.5 4.3 3.5 6.6c0 1.5.4 2.6 1 3.4h15c.6-.8 1-1.9 1-3.4 0-2.3-1.5-4.1-4-4.1-1.9 0-2.9.9-4.5.9s-2.6-.9-4.5-.9Z" />
    <path d="M8.5 12.5h7l-1.2 9h-4.6Z" />
    <path d="M8.9 15.2h6.2M9.3 18h5.4" />
  </Svg>
);

export const ToothRoot = (p) => (
  <Svg {...p}>
    <path d={TOOTH} />
    <path d="M10.2 8.5c.3 2.4.3 4.6 0 6.8M13.8 8.5c-.3 2.4-.3 4.6 0 6.8" />
  </Svg>
);

export const ToothBraces = (p) => (
  <Svg {...p}>
    <path d={TOOTH} />
    <rect x="9.5" y="7.6" width="5" height="4" rx="1" />
    <path d="M1.5 9.6h8M14.5 9.6h8" />
  </Svg>
);

export const ToothAligner = (p) => (
  <Svg {...p}>
    <path d={TOOTH} />
    <path d="M2 8.2C2 4.3 4.6 1.5 7.6 1.5M22 8.2c0-3.9-2.6-6.7-5.6-6.7" strokeDasharray="2 2" />
  </Svg>
);

export const ToothCrown = (p) => (
  <Svg {...p}>
    <path d="m7.5 9.5-.9-5 3 2.2L12 3l2.4 3.7 3-2.2-.9 5Z" />
    <path d="M5.5 12c.7 1.2 1.3 2.4 1.7 3.9.5 1.8.7 5.1 2.2 5.1s1.4-3.2 1.8-4.3c.2-.6.5-.9.8-.9s.6.3.8.9c.4 1.1.3 4.3 1.8 4.3s1.7-3.3 2.2-5.1c.4-1.5 1-2.7 1.7-3.9Z" />
  </Svg>
);

export const ToothSparkle = (p) => (
  <Svg {...p}>
    <path d="M6.5 4.5C4.4 4.5 3 6.1 3 8.2c0 1.8.7 3.1 1.3 4.4.5 1.1.8 2.4 1 3.7.2 1.7.6 3.7 1.7 3.7 1.2 0 1.4-2.1 1.7-3.4.2-.8.6-1.2 1.6-1.2s1.4.4 1.6 1.2c.3 1.3.5 3.4 1.7 3.4 1.1 0 1.5-2 1.7-3.7.2-1.3.5-2.6 1-3.7.6-1.3 1.3-2.6 1.3-4.4 0-2.1-1.4-3.7-3.5-3.7-1.6 0-2.5.8-3.8.8s-2.2-.8-3.8-.8Z" />
    <path d="M19.5 1.5v4M17.5 3.5h4M21 9v2M20 10h2" />
  </Svg>
);

export const ToothShield = (p) => (
  <Svg {...p}>
    <path d={TOOTH} />
    <path d="m9.4 10.3 1.8 1.8 3.4-3.6" />
  </Svg>
);
