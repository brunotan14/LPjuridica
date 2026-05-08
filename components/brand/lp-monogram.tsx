type Props = {
  size?: number
  className?: string
}

export function LPMonogram({ size = 28, className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-label="LP"
      className={className}
    >
      <defs>
        <linearGradient id="lp_monogram_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d2d0f" />
          <stop offset="35%" stopColor="#c9a961" />
          <stop offset="55%" stopColor="#8b6f1f" />
          <stop offset="80%" stopColor="#e8d09a" />
          <stop offset="100%" stopColor="#3d2d0f" />
        </linearGradient>
        <linearGradient id="lp_monogram_shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <path d="M 0 -42 L 30 0 L 0 42 L -30 0 Z" fill="url(#lp_monogram_grad)" />
        <path d="M 0 -42 L 30 0 L 0 42 L -30 0 Z" fill="url(#lp_monogram_shine)" />
        <path
          d="M 0 -34 L 24 0 L 0 34 L -24 0 Z"
          fill="none"
          stroke="#1a1408"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <g transform="translate(-9,0)">
          <path
            d="M -10 -22 L -3 -22 L -3 16 L 16 16 L 16 22 L -10 22 Z"
            fill="#0a0805"
            stroke="#e8d09a"
            strokeWidth="0.8"
          />
          <rect x="-13" y="-23" width="6" height="2" fill="#e8d09a" />
        </g>
        <g transform="translate(6,4) rotate(-8)">
          <path
            d="M -5 -17 C -7 -13 -8 -5 -6 4 C -4 13 1 17 11 18 L 16 18 L 16 14 L 11 13 C 3 12 -2 7 -3 2 C -5 -5 -3 -12 -1 -17 Z"
            fill="url(#lp_monogram_grad)"
            stroke="#e8d09a"
            strokeWidth="0.4"
          />
        </g>
      </g>
    </svg>
  )
}
