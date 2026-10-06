"use client"

import Image from "next/image"
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "motion/react"
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import type { Dictionary } from "@/lib/i18n/types"
import { PROJECT_IMAGES } from "./realisations.content"
import styles from "./miau-carousel.module.css"

const PHONES = [
  { id: "map", src: PROJECT_IMAGES.map, className: styles.mapPhone, width: 887, height: 1774 },
  { id: "auth", src: PROJECT_IMAGES.auth, className: styles.authPhone, width: 887, height: 1774 },
  { id: "orion", src: PROJECT_IMAGES.orion, className: styles.orionPhone, width: 887, height: 1774 },
] as const

const COUNT = PHONES.length
const ANGLE = Math.PI * 2 / COUNT
const ORBIT_WIDTH = 0.48
const wrap = (value: number) => (value % COUNT + COUNT) % COUNT
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

type Gesture = {
  id: number
  startX: number
  startY: number
  lastX: number
  lastTime: number
  velocity: number
  origin: number
  step: number
  axis: "x" | "y" | null
}

/** Original mobile carousel: continuous drag, blurred sides and morphing indicators. */
export function MiauCarousel({ copy }: { copy: Dictionary["showcase"] }) {
  const [mobile, setMobile] = useState(false)
  const [active, setActive] = useState(1)
  const reduced = Boolean(useReducedMotion())
  const position = useMotionValue(1)
  const selected = useRef(1)
  const gesture = useRef<Gesture | null>(null)
  const animation = useRef<{ stop(): void } | null>(null)
  const destination = useRef<number | null>(null)
  const labels = copy.carousel

  useMotionValueEvent(position, "change", value => {
    const next = wrap(Math.round(value))
    if (next !== selected.current) {
      selected.current = next
      setActive(next)
    }
  })

  useEffect(() => {
    const media = window.matchMedia("(max-width: 699px)")
    const update = () => {
      gesture.current = null
      animation.current?.stop()
      destination.current = null
      position.set(Math.round(position.get()))
      setMobile(media.matches)
    }
    update()
    media.addEventListener("change", update)
    return () => {
      media.removeEventListener("change", update)
      animation.current?.stop()
    }
  }, [position])

  const settle = (target: number, velocity = position.getVelocity()) => {
    animation.current?.stop()
    destination.current = target
    if (reduced) {
      position.set(target)
      destination.current = null
      return
    }
    animation.current = animate(position, target, {
      type: "spring", stiffness: 240, damping: 32, mass: 1,
      velocity: clamp(velocity, -5, 5), restDelta: 0.001, restSpeed: 0.005,
      onComplete: () => { destination.current = null },
    })
  }

  const advance = (direction: number) => settle(Math.round(destination.current ?? position.get()) + direction)
  const goTo = (index: number) => {
    const current = Math.round(position.get())
    const difference = wrap(index - wrap(current) + 1) - 1
    settle(current + difference)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!mobile || !event.isPrimary || event.button !== 0) return
    const phone = event.currentTarget.querySelector<HTMLElement>("[data-carousel-phone]")
    gesture.current = {
      id: event.pointerId, startX: event.clientX, startY: event.clientY,
      lastX: event.clientX, lastTime: event.timeStamp, velocity: 0,
      origin: position.get(), step: Math.max(1, (phone?.offsetWidth ?? 260) * ORBIT_WIDTH * ANGLE), axis: null,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = gesture.current
    if (!pointer || pointer.id !== event.pointerId) return
    const dx = event.clientX - pointer.startX
    const dy = event.clientY - pointer.startY
    if (!pointer.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return
      pointer.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      if (pointer.axis === "x") {
        animation.current?.stop()
        destination.current = null
        pointer.origin = position.get()
      }
    }
    if (pointer.axis !== "x") return
    event.preventDefault()
    const elapsed = event.timeStamp - pointer.lastTime
    if (elapsed > 0) {
      const velocity = -(event.clientX - pointer.lastX) / elapsed * 1000 / pointer.step
      pointer.velocity = pointer.velocity * 0.25 + velocity * 0.75
    }
    pointer.lastX = event.clientX
    pointer.lastTime = event.timeStamp
    // The same fractional position drives every device and indicator, on each move.
    position.set(pointer.origin - dx / pointer.step)
  }

  const finishGesture = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const pointer = gesture.current
    if (!pointer || pointer.id !== event.pointerId) return
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (pointer.axis !== "x") return
    const velocity = cancelled || event.timeStamp - pointer.lastTime > 100 ? 0 : clamp(pointer.velocity, -5, 5)
    const current = position.get()
    const travel = current - pointer.origin
    let target = Math.round(current + velocity * 0.18)
    if (!cancelled && target === Math.round(pointer.origin) && Math.abs(travel) > 0.22) target += Math.sign(travel)
    settle(target, velocity)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!mobile) return
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      advance(event.key === "ArrowRight" ? 1 : -1)
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      goTo(event.key === "Home" ? 0 : COUNT - 1)
    }
  }

  return (
    <div className={styles.phoneVisual} data-miau-carousel role="region" aria-label={labels.label}
      tabIndex={mobile ? 0 : undefined} onKeyDown={onKeyDown}>
      <div
        className={styles.phoneGroup}
        data-carousel-group
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={event => finishGesture(event)}
        onPointerCancel={event => finishGesture(event, true)}
        onLostPointerCapture={event => finishGesture(event, true)}
      >
        {PHONES.map((phone, index) => (
          <CarouselPhone key={phone.id} phone={phone} index={index} position={position}
            mobile={mobile} reduced={reduced} active={active} alt={copy.phones[index]} />
        ))}
      </div>

      <div className={styles.phoneControls}>
        <button type="button" className={styles.phoneArrow} aria-label={labels.previous} onClick={() => advance(-1)}>
          <Chevron direction="previous" />
        </button>
        <div className={styles.phoneDots} role="group" aria-label={labels.navigation}>
          {PHONES.map((phone, index) => (
            <CarouselDot key={phone.id} index={index} position={position} label={labels.screens[index]}
              active={index === active} onClick={() => goTo(index)} />
          ))}
        </div>
        <button type="button" className={styles.phoneArrow} aria-label={labels.next} onClick={() => advance(1)}>
          <Chevron direction="next" />
        </button>
        <span className={styles.phoneAnnouncement} aria-live="polite" aria-atomic="true">
          {active + 1} / {COUNT} — {labels.screens[active]}
        </span>
      </div>
    </div>
  )
}

function CarouselPhone({ phone, index, position, mobile, reduced, active, alt }: {
  phone: typeof PHONES[number]; index: number; position: MotionValue<number>
  mobile: boolean; reduced: boolean; active: number; alt: string
}) {
  // A continuous orbit has no modulo seam: the third device passes behind the
  // other two rather than jumping from one edge to the other on each swipe.
  const transform = useTransform(position, value => {
    const angle = (index - value) * ANGLE
    const depth = 1 - Math.cos(angle)
    return `translate3d(${Math.sin(angle) * ORBIT_WIDTH * 100}%, 0, ${reduced ? 0 : -depth * 78}px) rotateY(${reduced ? 0 : -Math.sin(angle) * 20}deg) scale(${1 - depth * 0.09})`
  })
  const opacity = useTransform(position, value => 1 - (1 - Math.cos((index - value) * ANGLE)) * 0.11)
  const filter = useTransform(position, value => `blur(${Math.min(1, (1 - Math.cos((index - value) * ANGLE)) / 1.5) * 5}px)`)
  const zIndex = useTransform(position, value => Math.round(100 + Math.cos((index - value) * ANGLE) * 50))

  return (
    <motion.div className={`${styles.phone} ${phone.className}`} data-carousel-phone={phone.id}
      style={mobile ? { zIndex } : undefined}
      aria-hidden={mobile && index !== active ? true : undefined}>
      <motion.div className={styles.phoneOrbit}
        style={{ transform: mobile ? transform : "none", opacity: mobile ? opacity : 1, filter: mobile ? filter : "none" }}>
        <div className={styles.phonePose}><div>
          <Image src={phone.src} alt={alt} width={phone.width} height={phone.height}
            quality={90} sizes="(max-width: 699px) 81vw, (max-width: 1199px) 32vw, 420px" draggable={false} />
        </div></div>
      </motion.div>
    </motion.div>
  )
}

function CarouselDot({ index, position, label, active, onClick }: {
  index: number; position: MotionValue<number>; label: string; active: boolean; onClick(): void
}) {
  const progress = useTransform(position, value => {
    const distance = Math.abs(index - wrap(value))
    return Math.max(0, 1 - Math.min(distance, COUNT - distance))
  })
  const scaleX = useTransform(progress, [0, 1], [2 / 7, 1])
  const opacity = useTransform(progress, [0, 1], [0.28, 1])
  return (
    <button type="button" className={styles.phoneDot} aria-label={label}
      aria-current={active ? "true" : undefined} onClick={onClick}>
      <motion.span style={{ scaleX, opacity }} />
    </button>
  )
}

function Chevron({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d={direction === "previous" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
