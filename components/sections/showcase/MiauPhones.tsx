import Image from "next/image"
import type { Dictionary } from "@/lib/i18n/types"
import { PROJECT_IMAGES } from "./realisations.content"
import { MiauCarousel } from "./MiauCarousel"
import styles from "./miau.module.css"

const PHONES = [
  { id: "map", src: PROJECT_IMAGES.map, className: styles.mapPhone, width: 887, height: 1774, parallax: "0.07" },
  { id: "auth", src: PROJECT_IMAGES.auth, className: styles.authPhone, width: 887, height: 1774, parallax: "0.11" },
  { id: "orion", src: PROJECT_IMAGES.orion, className: styles.orionPhone, width: 887, height: 1774, parallax: "0.07" },
] as const

/** Desktop reveal and the original mobile carousel have independent motion layers. */
export function MiauPhones({ copy }: { copy: Dictionary["showcase"] }) {
  return (
    <>
      <div className={styles.phoneVisual} data-miau-visual role="group" aria-label={copy.carousel.label}>
        <div className={styles.phoneGroup} data-phone-group>
          {PHONES.map((phone, index) => (
            <div key={phone.id} className={`${styles.phoneSlot} ${phone.className}`} data-phone-slot={phone.id}>
              <div className={styles.phoneParallax} data-device-parallax={phone.parallax}>
                <div className={styles.phone} data-phone={phone.id}>
                  <i className={styles.phoneShadow} aria-hidden="true" />
                  <Image
                    src={phone.src} alt={copy.phones[index]} width={phone.width} height={phone.height}
                    quality={90} sizes="(max-width: 699px) 0px, 360px"
                    loading="lazy" draggable={false}
                  />
                  <span className={styles.screenReflection} aria-hidden="true">
                    <i className={styles.reflectionBand} data-phone-reflection />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MiauCarousel copy={copy} />
    </>
  )
}
