import * as React from "react";

/**
 * Hook to detect if the current viewport is mobile
 */
export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Check on mount
		checkDevice();

		// Add listener for resize
		window.addEventListener("resize", checkDevice);

		// Cleanup
		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	return isMobile;
}
