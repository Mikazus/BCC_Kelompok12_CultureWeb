"use client";

import { useEffect, useRef, useState } from "react";

type BarcodeDetectorResult = {
	rawValue?: string;
};

type BarcodeDetectorInstance = {
	detect: (input: ImageBitmapSource) => Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorInstance;

type QrCameraScannerProps = {
	onDetected: (value: string) => void;
};

export default function QrCameraScanner({ onDetected }: QrCameraScannerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const frameRef = useRef<number | null>(null);
	const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
	const lastValueRef = useRef<string>("");
	const [status, setStatus] = useState("Menyalakan kamera...");

	useEffect(() => {
		let isDisposed = false;

		const stopScanner = () => {
			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}
		};

		const scan = async () => {
			if (isDisposed || !videoRef.current || !detectorRef.current) {
				return;
			}

			if (videoRef.current.readyState >= 2) {
				try {
					const results = await detectorRef.current.detect(videoRef.current as unknown as ImageBitmapSource);
					const nextValue = results[0]?.rawValue?.trim();

					if (nextValue && nextValue !== lastValueRef.current) {
						lastValueRef.current = nextValue;
						setStatus("QR terdeteksi");
						onDetected(nextValue);
					}
				} catch {
					setStatus("Scanner aktif, arahkan QR ke kamera");
				}
			}

			frameRef.current = requestAnimationFrame(scan);
		};

		const startScanner = async () => {
			if (!navigator.mediaDevices?.getUserMedia) {
				setStatus("Perangkat tidak mendukung akses kamera");
				return;
			}

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: "environment" },
					},
					audio: false,
				});

				if (isDisposed) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}

				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
				}

				const maybeCtor = (globalThis as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
				if (!maybeCtor) {
					setStatus("Kamera aktif, browser belum mendukung scan QR otomatis");
					return;
				}

				detectorRef.current = new maybeCtor({ formats: ["qr_code"] });
				setStatus("Scanner aktif, arahkan QR ke kamera");
				frameRef.current = requestAnimationFrame(scan);
			} catch {
				setStatus("Izin kamera ditolak atau kamera tidak tersedia");
			}
		};

		void startScanner();

		return () => {
			isDisposed = true;
			stopScanner();
		};
	}, [onDetected]);

	return (
		<div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#F8F6F1]">
			<video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
			<div className="pointer-events-none absolute inset-0 grid place-items-center">
				<div className="relative h-44 w-44 rounded-3xl border-2 border-[#A88648]/70">
					<div className="absolute -left-1 -top-1 h-9 w-9 rounded-tl-2xl border-l-4 border-t-4 border-[#A88648]" />
					<div className="absolute -right-1 -top-1 h-9 w-9 rounded-tr-2xl border-r-4 border-t-4 border-[#A88648]" />
					<div className="absolute -bottom-1 -left-1 h-9 w-9 rounded-bl-2xl border-b-4 border-l-4 border-[#A88648]" />
					<div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-br-2xl border-b-4 border-r-4 border-[#A88648]" />
				</div>
			</div>
			<p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#433A2D]/75 px-3 py-1 text-xs text-[#F8F1E1]">
				{status}
			</p>
		</div>
	);
}
