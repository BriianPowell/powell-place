import { icons } from '@/lib/icons'

type EarthIconProps = {
  className: string
  width: number
  height: number
  src?: string
}

export function EarthIcon({
  className,
  width,
  height,
  src = icons.earth,
}: EarthIconProps) {
  return (
    <img
      src={src}
      alt=""
      className={className}
      width={width}
      height={height}
      decoding="async"
    />
  )
}
