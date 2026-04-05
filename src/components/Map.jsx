import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_TOKEN;

export default function Map() {
	const mapContainer = useRef(null);
	const mapInstance = useRef(null);
	const [isDark, setIsDark] = useState(
		typeof document !== "undefined" && document.documentElement.classList.contains("dark")
	);
	const [webGLSupported, setWebGLSupported] = useState(true);
	const zoomLevels = [9, 5, 3];
	const [zoomIndex, setZoomIndex] = useState(0);
	const [plusVisible, setPlusVisible] = useState(false);

	const controlButtonStyle = {
		background: isDark ? "rgba(9, 9, 11, 0.8)" : "rgba(255, 255, 255, 0.9)",
		color: isDark ? "#fff" : "#000",
		width: 44,
		height: 44,
		borderRadius: 9999,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		zIndex: 1,
		boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		transition: "transform 0.3s ease, box-shadow 0.2s ease, opacity 0.3s ease",
		willChange: "transform",
	};

	const handleZoomIn = () => {
		setZoomIndex(prev => {
			if (prev <= 0) return prev;
			const next = prev - 1;
			if (mapInstance.current) {
				mapInstance.current.easeTo({ zoom: zoomLevels[next], duration: 800 });
			}
			return next;
		});
	};

	const handleZoomOut = () => {
		setZoomIndex(prev => {
			if (prev >= zoomLevels.length - 1) return prev;
			const next = prev + 1;
			if (mapInstance.current) {
				mapInstance.current.easeTo({ zoom: zoomLevels[next], duration: 1200 });
			}
			return next;
		});
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (!mapboxgl.supported()) {
			setWebGLSupported(false);
			return;
		}
		if (mapInstance.current) return;

		mapInstance.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: isDark
				? "mapbox://styles/mapbox/navigation-night-v1"
				: "mapbox://styles/mapbox/standard",
			center: [21.0, 52.2],
			zoom: zoomLevels[0],
			scrollZoom: false,
			doubleClickZoom: false,
			touchZoomRotate: false,
		});

		const markerEl = document.createElement("div");
		markerEl.style.width = "100px";
		markerEl.style.height = "100px";
		markerEl.style.borderRadius = "50%";
		markerEl.style.border = "3px solid rgb(255, 255, 255)";
		markerEl.style.background = "rgba(152, 208, 255, 0.5)";
		markerEl.style.zIndex = "1";
		markerEl.style.display = "flex";
		markerEl.style.alignItems = "center";
		markerEl.style.justifyContent = "center";
		markerEl.style.position = "relative";
		markerEl.style.willChange = "transform";

		const innerDiv = document.createElement("div");
		innerDiv.style.position = "relative";
		innerDiv.style.width = "100%";
		innerDiv.style.height = "100%";

		const img = document.createElement("img");
		img.src = "/assets/duck.webp";
		img.style.visibility = "inherit";
		img.style.position = "absolute";
		img.style.inset = "0px";
		img.style.boxSizing = "border-box";
		img.style.padding = "0px";
		img.style.border = "none";
		img.style.margin = "auto";
		img.style.display = "block";
		img.style.width = "0px";
		img.style.height = "0px";
		img.style.minWidth = "50%";
		img.style.maxWidth = "50%";
		img.style.minHeight = "50%";
		img.style.maxHeight = "50%";

		innerDiv.appendChild(img);
		markerEl.appendChild(innerDiv);

		new mapboxgl.Marker(markerEl)
			.setLngLat([21.0, 52.22])
			.addTo(mapInstance.current);

		return () => {
			mapInstance.current.remove();
			mapInstance.current = null;
		};
	}, []);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const dark = document.documentElement.classList.contains("dark");
			if (dark !== isDark) {
				const newStyle = dark
					? "mapbox://styles/mapbox/navigation-night-v1"
					: "mapbox://styles/mapbox/standard";

				if (mapInstance.current) {
					mapInstance.current.setStyle(newStyle);
				}
				setIsDark(dark);
			}
		});

		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, [isDark]);

	useEffect(() => {
		setPlusVisible(zoomIndex !== 0);
	}, [zoomIndex]);

	if (!webGLSupported) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					padding: 16,
					boxSizing: "border-box",
					color: isDark ? "#a1a1aa" : "#71717a",
					fontSize: 13,
					textAlign: "center",
				}}
			>
				<span style={{ fontSize: 28 }}>🗺️</span>
				<span>Map unavailable</span>
				<span style={{ fontSize: 11, opacity: 0.7 }}>Enable hardware acceleration in your browser</span>
			</div>
		);
	}

	return (
		<div style={{ position: "relative", width: "100%", height: "120%" }}>
			<div ref={mapContainer} style={{ width: "100%", height: "100%", position: "absolute" }} />

			{/* Zoom Buttons */}
			<div
				style={{
					position: "absolute",
					bottom: 65,
					left: 14,
					right: 14,
					display: "flex",
					justifyContent: "space-between",
					pointerEvents: "none",
				}}
			>
				<button
					onClick={handleZoomOut}
					onMouseEnter={e => {
						e.currentTarget.style.transform = "scale(1.08)";
					}}
					onMouseLeave={e => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					style={{
						...controlButtonStyle,
						pointerEvents: "auto",
					}}
				>
					<span style={{ fontSize: 22, lineHeight: 1 }}>−</span>
				</button>

				<button
					onClick={handleZoomIn}
					onMouseEnter={e => {
						e.currentTarget.style.transform = "scale(1.08)";
					}}
					onMouseLeave={e => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					style={{
						...controlButtonStyle,
						opacity: plusVisible ? 1 : 0,
						pointerEvents: plusVisible ? "auto" : "none",
					}}
				>
					<span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
				</button>
			</div>
		</div>
	);
}
