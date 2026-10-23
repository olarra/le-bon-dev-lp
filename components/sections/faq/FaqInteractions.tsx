"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type Transition = { animation: Animation; opening: boolean; height: number }

/** Enhance the server-rendered groups into tabs; native links remain usable without JS. */
export function FaqInteractions({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)")
    const mobile = window.matchMedia("(max-width: 809.98px)")
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-faq-group]"))
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-faq-topic]"))
    const topics = root.querySelector<HTMLOListElement>("[data-faq-topics]")
    const panels = root.querySelector<HTMLDivElement>("[data-faq-panels]")
    if (!topics || !panels || !groups.length) return
    const accordions = Array.from(root.querySelectorAll<HTMLDetailsElement>("[data-faq-item]"))
    const nativeNames = new Map(accordions.map(details => [details, details.getAttribute("name")]))
    const transitions = new Map<HTMLDetailsElement, Transition>()
    let activeGroup: HTMLElement | undefined
    let panelAnimation: Animation | undefined
    let panelSizeAnimation: Animation | undefined
    let outgoingAnimation: Animation | undefined
    let outgoingGroup: HTMLElement | undefined
    let refreshFrame = 0
    let anchorFrame = 0
    let previousAnchoring: { value: string; priority: string } | undefined
    const documentStyle = document.documentElement.style

    const restoreAnchoring = () => {
      cancelAnimationFrame(anchorFrame)
      anchorFrame = 0
      if (!previousAnchoring) return
      const { value, priority } = previousAnchoring
      if (value) documentStyle.setProperty("overflow-anchor", value, priority)
      else documentStyle.removeProperty("overflow-anchor")
      previousAnchoring = undefined
    }
    const holdAnchoring = () => {
      cancelAnimationFrame(anchorFrame)
      anchorFrame = 0
      if (previousAnchoring) return
      previousAnchoring = {
        value: documentStyle.getPropertyValue("overflow-anchor"),
        priority: documentStyle.getPropertyPriority("overflow-anchor"),
      }
      // A visible section below the FAQ can become the browser's scroll anchor.
      // Suspend that adjustment only while the FAQ changes height.
      documentStyle.setProperty("overflow-anchor", "none")
    }

    // Refresh downstream reveals after the FAQ has reached its final height.
    const refreshLayout = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0
        if (!panelSizeAnimation && !transitions.size) {
          ScrollTrigger.refresh()
          anchorFrame = requestAnimationFrame(restoreAnchoring)
        }
      })
    }
    const settle = (details: HTMLDetailsElement, transition: Transition) => {
      if (transitions.get(details) !== transition) return
      transitions.delete(details)
      details.open = transition.opening
      transition.animation.cancel()
      details.style.removeProperty("overflow")
      details.removeAttribute("data-faq-closing")
    }
    const settleAccordions = () => {
      transitions.forEach((transition, details) => settle(details, transition))
    }
    const setAccordion = (details: HTMLDetailsElement, opening: boolean, animate = true) => {
      const previous = transitions.get(details)
      if (previous?.opening === opening || (!previous && details.open === opening)) return
      const summary = details.querySelector<HTMLElement>("[data-faq-question]")
      if (!summary) return
      holdAnchoring()
      const from = details.getBoundingClientRect().height
      previous?.animation.cancel()
      transitions.delete(details)

      if (!animate || !motion.matches || !details.animate) {
        details.open = opening
        details.style.removeProperty("overflow")
        details.removeAttribute("data-faq-closing")
        return
      }

      details.open = true
      details.toggleAttribute("data-faq-closing", !opening)
      const style = getComputedStyle(details)
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      const to = opening ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + border
      details.style.overflow = "hidden"
      const animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 300,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "both",
      })
      const transition = { animation, opening, height: to }
      transitions.set(details, transition)
      animation.onfinish = () => {
        settle(details, transition)
        if (!transitions.size) refreshLayout()
      }
    }
    const closeOtherAnswers = (details: HTMLDetailsElement, animate = true) => {
      const group = details.closest<HTMLElement>("[data-faq-group]")
      group?.querySelectorAll<HTMLDetailsElement>("[data-faq-item]").forEach(other => {
        if (other !== details && (other.open || transitions.has(other))) setAccordion(other, false, animate)
      })
    }
    const stopPanelTransition = () => {
      panelAnimation?.cancel()
      panelSizeAnimation?.cancel()
      outgoingAnimation?.cancel()
      panels.removeAttribute("data-faq-resizing")
      outgoingGroup?.removeAttribute("data-faq-outgoing")
      panelAnimation = undefined
      panelSizeAnimation = undefined
      outgoingAnimation = undefined
      outgoingGroup = undefined
    }
    const resizePanels = (from: number, duration: number) => {
      if (!activeGroup) return
      let to = activeGroup.getBoundingClientRect().height
      // A question clicked during a category fade may still be opening or closing.
      transitions.forEach((transition, details) => {
        if (activeGroup?.contains(details)) to += transition.height - details.getBoundingClientRect().height
      })
      if (!motion.matches || !panels.animate || Math.abs(to - from) < 1) {
        refreshLayout()
        return
      }
      panels.setAttribute("data-faq-resizing", "")
      const animation = panels.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "both",
      })
      panelSizeAnimation = animation
      animation.onfinish = () => {
        if (panelSizeAnimation !== animation) return
        panelSizeAnimation = undefined
        animation.cancel()
        panels.removeAttribute("data-faq-resizing")
        refreshLayout()
      }
    }
    const selectGroup = (group: HTMLElement, animate = true) => {
      if (group === activeGroup) return
      holdAnchoring()
      const fromHeight = panels.getBoundingClientRect().height
      const previousGroup = activeGroup
      const previousOpacity = previousGroup ? getComputedStyle(previousGroup).opacity : "1"
      const incomingOpacity = group === outgoingGroup ? getComputedStyle(group).opacity : "0"
      stopPanelTransition()
      settleAccordions()
      const selectedLink = links.find(link => link.dataset.faqTopic === group.dataset.faqGroup)
      if (activeGroup?.contains(document.activeElement)) selectedLink?.focus({ preventScroll: true })
      activeGroup = group
      links.forEach(link => {
        const selected = link === selectedLink
        link.setAttribute("aria-selected", String(selected))
        link.tabIndex = selected ? 0 : -1
      })
      groups.forEach(panel => {
        const selected = panel === group
        panel.toggleAttribute("data-faq-active", selected)
        panel.inert = !selected
        panel.tabIndex = selected ? 0 : -1
        if (selected) panel.removeAttribute("aria-hidden")
        else panel.setAttribute("aria-hidden", "true")
      })

      if (!animate || !motion.matches || !group.animate) {
        refreshLayout()
        return
      }

      // Crossfade in place while adapting the document flow to the selected group.
      if (previousGroup) {
        previousGroup.setAttribute("data-faq-outgoing", "")
        outgoingGroup = previousGroup
        const departure = previousGroup.animate([{ opacity: previousOpacity }, { opacity: 0 }], {
          duration: 180, easing: "ease-out", fill: "both",
        })
        outgoingAnimation = departure
        departure.onfinish = () => {
          if (outgoingAnimation !== departure) return
          previousGroup.removeAttribute("data-faq-outgoing")
          outgoingGroup = undefined
          outgoingAnimation = undefined
          departure.cancel()
        }
      }
      const entrance = group.animate([
        { opacity: incomingOpacity },
        { opacity: 1 },
      ], { duration: 260, easing: "ease-out", fill: "both" })
      panelAnimation = entrance
      entrance.onfinish = () => {
        if (panelAnimation !== entrance) return
        panelAnimation = undefined
        entrance.cancel()
      }
      resizePanels(fromHeight, 260)
    }
    const activateTopic = (link: HTMLAnchorElement) => {
      const group = groups.find(panel => panel.dataset.faqGroup === link.dataset.faqTopic)
      if (!group) return
      selectGroup(group)
      // Keep the selected category shareable without scrolling the page.
      if (window.location.hash !== link.hash) window.history.replaceState(window.history.state, "", link.hash)
    }
    const groupFromHash = () => {
      let target: HTMLElement | null
      try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))) }
      catch { return undefined }
      return groups.find(group => target && group.contains(target))
    }
    const restoreTopic = () => {
      const group = groupFromHash()
      if (group) selectGroup(group, false)
    }
    const orientTopics = () => topics.setAttribute("aria-orientation", mobile.matches ? "horizontal" : "vertical")
    const settleAll = () => {
      stopPanelTransition()
      settleAccordions()
      refreshLayout()
    }
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return
      const topic = event.target.closest<HTMLAnchorElement>("[data-faq-topic]")
      if (topic) {
        event.preventDefault()
        activateTopic(topic)
        return
      }

      const summary = event.target.closest<HTMLElement>("[data-faq-question]")
      const details = summary?.parentElement
      if (!summary || !(details instanceof HTMLDetailsElement)) return
      event.preventDefault()
      holdAnchoring()
      const resizingFrom = panelSizeAnimation ? panels.getBoundingClientRect().height : undefined
      stopPanelTransition()

      const opening = !(transitions.get(details)?.opening ?? details.open)
      if (opening) closeOtherAnswers(details)
      setAccordion(details, opening)
      if (resizingFrom !== undefined) resizePanels(resizingFrom, 300)
      if (!transitions.size) refreshLayout()
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || !(event.target instanceof Element)) return
      const topic = event.target.closest<HTMLAnchorElement>("[data-faq-topic]")
      if (!topic) return
      const index = links.indexOf(topic)
      let next = index
      if (event.key === "Home") next = 0
      else if (event.key === "End") next = links.length - 1
      else if (event.key === (mobile.matches ? "ArrowRight" : "ArrowDown")) next = (index + 1) % links.length
      else if (event.key === (mobile.matches ? "ArrowLeft" : "ArrowUp")) next = (index - 1 + links.length) % links.length
      else if (event.key !== " ") return
      event.preventDefault()
      links[next].focus({ preventScroll: true })
      activateTopic(links[next])
    }
    const nativeToggle = (event: Event) => {
      const details = event.target
      if (!(details instanceof HTMLDetailsElement) || !details.hasAttribute("data-faq-item") || transitions.has(details)) return
      if (details.open) closeOtherAnswers(details, false)
      if (!transitions.size) refreshLayout()
    }
    const resize = () => {
      settleAll()
      orientTopics()
    }

    // Native grouping is the no-JS fallback; JS coordinates both animations.
    accordions.forEach(details => details.removeAttribute("name"))
    topics.setAttribute("role", "tablist")
    topics.setAttribute("aria-label", topics.parentElement?.getAttribute("aria-label") ?? "")
    links.forEach(link => {
      link.setAttribute("role", "tab")
      link.parentElement?.setAttribute("role", "presentation")
    })
    groups.forEach(group => {
      group.setAttribute("role", "tabpanel")
      group.setAttribute("aria-labelledby", `faq-topic-${group.dataset.faqGroup}`)
    })
    panels.setAttribute("data-faq-tabs", "")
    orientTopics()
    selectGroup(groupFromHash() ?? groups[0], false)
    root.addEventListener("click", click)
    root.addEventListener("keydown", keydown)
    root.addEventListener("toggle", nativeToggle, true)
    window.addEventListener("hashchange", restoreTopic, true)
    window.addEventListener("resize", resize, { passive: true })
    motion.addEventListener("change", settleAll)
    return () => {
      root.removeEventListener("click", click)
      root.removeEventListener("keydown", keydown)
      root.removeEventListener("toggle", nativeToggle, true)
      window.removeEventListener("hashchange", restoreTopic, true)
      window.removeEventListener("resize", resize)
      motion.removeEventListener("change", settleAll)
      cancelAnimationFrame(refreshFrame)
      stopPanelTransition()
      settleAccordions()
      restoreAnchoring()
      nativeNames.forEach((name, details) => { if (name) details.setAttribute("name", name) })
      topics.removeAttribute("role")
      topics.removeAttribute("aria-label")
      topics.removeAttribute("aria-orientation")
      links.forEach(link => {
        link.removeAttribute("role")
        link.removeAttribute("aria-selected")
        link.removeAttribute("tabindex")
        link.parentElement?.removeAttribute("role")
      })
      groups.forEach(group => {
        group.inert = false
        group.removeAttribute("data-faq-active")
        group.removeAttribute("aria-hidden")
        group.removeAttribute("role")
        group.removeAttribute("tabindex")
        group.setAttribute("aria-labelledby", `${group.id}-title`)
      })
      panels.removeAttribute("data-faq-tabs")
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
