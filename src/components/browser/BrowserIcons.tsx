import { icons } from '@/lib/icons'

type IconProps = {
  className?: string
}

/** Title bar — underscore bar flush to bottom (Win9x minimize). */
export function IconWinMinimize({ className }: IconProps) {
  return (
    <img
      className={className}
      src={icons.browser.minimize}
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
      src={icons.browser.maximize}
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
      src={icons.browser.back}
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
      src={icons.browser.forward}
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
      src={icons.browser.home}
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}

/** Classic Win9x bottom-right resize grip (three diagonal stripes). */
export function IconResizeGrip({ className }: IconProps) {
  return (
    <img
      className={className}
      src={icons.browser.resizeGrip}
      alt=""
      aria-hidden
      draggable={false}
    />
  )
}
