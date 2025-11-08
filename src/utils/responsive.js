import { useMediaQuery } from 'react-responsive';

function useIsWide() {
	return useMediaQuery({ minWidth: 900 });
}

export { useIsWide };
