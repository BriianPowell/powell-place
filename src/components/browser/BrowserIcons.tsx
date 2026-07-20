type IconProps = {
  className?: string
}

/** Title bar — underscore bar flush to bottom (Win9x minimize). */
export function IconWinMinimize({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/minimize.svg"
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** Title bar — hollow square (Win9x maximize). */
export function IconWinMaximize({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/maximize.svg"
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** IE-style Back (green arrow). */
export function IconBack({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/arrow_left.png"
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** IE-style Forward (green arrow). */
export function IconForward({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/arrow_right.png"
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** IE-style Home (house). */
export function IconHome({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/home.png"
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** Classic Win9x bottom-right resize grip (three diagonal stripes). */
export function IconResizeGrip({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 13 13"
      width="13"
      height="13"
      aria-hidden
    >
      <g fill="none" strokeLinecap="square" shapeRendering="crispEdges">
        <path d="M9 13 L13 9" stroke="#ffffff" strokeWidth="1" />
        <path d="M8 12 L12 8" stroke="#000000" strokeWidth="1" />
        <path d="M5 13 L13 5" stroke="#ffffff" strokeWidth="1" />
        <path d="M4 12 L12 4" stroke="#000000" strokeWidth="1" />
        <path d="M1 13 L13 1" stroke="#ffffff" strokeWidth="1" />
        <path d="M0 12 L12 0" stroke="#000000" strokeWidth="1" />
      </g>
    </svg>
  )
}

/** IE-style security zone globe (16×16). */
export function IconGlobe({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        fill="#1e50a2"
        stroke="#000"
        strokeWidth="0.75"
      />
      <path fill="#3cb371" d="M8 1.5c2.2 0 4 2.8 4 6.5H8V1.5z" />
      <path fill="#f0c040" d="M4 8c0 3.7 1.8 6.5 4 6.5V8H4z" />
      <ellipse
        cx="8"
        cy="8"
        rx="6.5"
        ry="2.5"
        fill="none"
        stroke="#0a246a"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  )
}

/** Small page icon for the status bar. */
export function IconStatusPage({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden
    >
      <rect
        x="3"
        y="2"
        width="10"
        height="12"
        fill="#fff"
        stroke="#000"
        strokeWidth="1"
      />
      <path fill="#000080" d="M5 5h6v1H5zm0 2h6v1H5zm0 2h4v1H5z" />
    </svg>
  )
}

export function IconDocument({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <rect
        x="2"
        y="1"
        width="12"
        height="14"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path fill="currentColor" d="M4 4h8v1H4zm0 2h8v1H4zm0 2h6v1H4z" />
    </svg>
  )
}
