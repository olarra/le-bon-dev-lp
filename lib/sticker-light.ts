export const STICKER_LIGHT_PROPERTIES = [
  "--sticker-foil-angle", "--sticker-foil-x", "--sticker-foil-y",
  "--sticker-gloss-x", "--sticker-gloss-y", "--sticker-gloss-angle",
  "--sticker-activity",
] as const

/** The existing sticker finish, driven by a local light position in [-1, 1]. */
export function setStickerLight(element: HTMLElement, x: number, y: number, activity: number) {
  element.style.setProperty("--sticker-foil-angle", `${210 + x * 140 + y * 75}deg`)
  element.style.setProperty("--sticker-foil-x", `${50 + x * 30}%`)
  element.style.setProperty("--sticker-foil-y", `${42 + y * 30}%`)
  element.style.setProperty("--sticker-gloss-x", `${50 + x * 60}%`)
  element.style.setProperty("--sticker-gloss-y", `${50 + y * 45}%`)
  element.style.setProperty("--sticker-gloss-angle", `${110 + x * 12 + y * 8}deg`)
  element.style.setProperty("--sticker-activity", String(activity))
}

export function clearStickerLight(element: HTMLElement) {
  STICKER_LIGHT_PROPERTIES.forEach(property => element.style.removeProperty(property))
}
