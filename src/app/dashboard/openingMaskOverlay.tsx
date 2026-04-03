"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import maskFull from "@/image/mask_full.png"
import maskLeft from "@/image/mask_left.png"
import maskRight from "@/image/mask_right.png"

const INTRO_KEY = "lokabudaya-opening-mask-v1"

type IntroPhase = "full" | "crack" | "fade"

const OpeningMaskOverlay = () => {
	const [isVisible, setIsVisible] = useState(() => {
		if (typeof window === "undefined") {
			return false
		}

		return window.sessionStorage.getItem(INTRO_KEY) !== "1"
	})
	const [phase, setPhase] = useState<IntroPhase>("full")
	const hasCrackedRef = useRef(false)
	const crackTimerRef = useRef<number | null>(null)
	const fadeTimerRef = useRef<number | null>(null)
	const doneTimerRef = useRef<number | null>(null)
	const failSafeTimerRef = useRef<number | null>(null)

	const clearTimers = useCallback(() => {
		if (crackTimerRef.current !== null) {
			window.clearTimeout(crackTimerRef.current)
			crackTimerRef.current = null
		}

		if (fadeTimerRef.current !== null) {
			window.clearTimeout(fadeTimerRef.current)
			fadeTimerRef.current = null
		}

		if (doneTimerRef.current !== null) {
			window.clearTimeout(doneTimerRef.current)
			doneTimerRef.current = null
		}

		if (failSafeTimerRef.current !== null) {
			window.clearTimeout(failSafeTimerRef.current)
			failSafeTimerRef.current = null
		}
	}, [])

	const runCrackSequence = useCallback((speed: "normal" | "fast") => {
		if (hasCrackedRef.current) {
			return
		}

		hasCrackedRef.current = true
		clearTimers()

		setPhase("crack")

		const fadeDelay = speed === "fast" ? 260 : 800
		const doneDelay = speed === "fast" ? 980 : 1600

		fadeTimerRef.current = window.setTimeout(() => {
			setPhase("fade")
		}, fadeDelay)

		doneTimerRef.current = window.setTimeout(() => {
			window.sessionStorage.setItem(INTRO_KEY, "1")
			setIsVisible(false)
		}, doneDelay)
	}, [clearTimers])

	useEffect(() => {
		if (typeof window === "undefined") {
			return
		}

		if (!isVisible) {
			return
		}

		hasCrackedRef.current = false

		crackTimerRef.current = window.setTimeout(() => {
			runCrackSequence("normal")
		}, 850)

		// Failsafe in case browser throttling or effect interruptions block the normal sequence.
		failSafeTimerRef.current = window.setTimeout(() => {
			setPhase("fade")
			window.sessionStorage.setItem(INTRO_KEY, "1")
			setIsVisible(false)
		}, 4200)

		const handleEarlyInteraction = () => {
			runCrackSequence("fast")
		}

		window.addEventListener("wheel", handleEarlyInteraction, { passive: true })
		window.addEventListener("touchmove", handleEarlyInteraction, { passive: true })
		window.addEventListener("scroll", handleEarlyInteraction, { passive: true })

		return () => {
			window.removeEventListener("wheel", handleEarlyInteraction)
			window.removeEventListener("touchmove", handleEarlyInteraction)
			window.removeEventListener("scroll", handleEarlyInteraction)
			clearTimers()
		}
	}, [isVisible, runCrackSequence, clearTimers])

	if (!isVisible) {
		return null
	}

	return (
		<div className={`opening-mask-overlay ${phase === "fade" ? "is-fading" : ""}`}>
			<div className="opening-mask-stage" aria-hidden>
				<div className={`opening-mask-full ${phase !== "full" ? "is-hidden" : ""}`}>
					<Image src={maskFull} alt="Opening mask" priority className="opening-mask-image" />
				</div>
				<div className={`opening-mask-split ${phase === "crack" || phase === "fade" ? "is-cracked" : ""}`}>
					<Image src={maskLeft} alt="Opening mask left" priority className="opening-mask-image opening-mask-left" />
					<Image src={maskRight} alt="Opening mask right" priority className="opening-mask-image opening-mask-right" />
				</div>
			</div>
		</div>
	)
}

export default OpeningMaskOverlay
