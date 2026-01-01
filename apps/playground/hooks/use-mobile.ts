import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		// Use matchMedia for better tracking of viewport changes
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

		const checkIsMobile = () => {
			// Use matchMedia.matches for more reliable detection
			setIsMobile(mql.matches);
		};

		// Set initial value
		checkIsMobile();

		// Listen to matchMedia changes (fires on orientation/resize)
		mql.addEventListener("change", checkIsMobile);

		// Also listen to resize events as a fallback for better compatibility
		// This ensures orientation changes are always caught
		window.addEventListener("resize", checkIsMobile);

		return () => {
			mql.removeEventListener("change", checkIsMobile);
			window.removeEventListener("resize", checkIsMobile);
		};
	}, []);

	return !!isMobile;
}
