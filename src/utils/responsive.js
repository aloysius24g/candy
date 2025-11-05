import { useMediaQuery } from 'react-responsive';

function useIsWide() {
  return useMediaQuery({ minWidth: 800 });
}

export { useIsWide };
