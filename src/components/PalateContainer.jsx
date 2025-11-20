import { useContext, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from './AppState';
import { isBrightColor } from '../utils/colorsUtils';
import Loader from './Loader';
import { getThemeColors } from '../utils/dataFetch';
import { toast } from 'react-toastify';
import ToolTipWrap from './ToolTipWrap';
import Draggable from './Draggable';

export default function PalateContainer({ className, compact }) {
  const { themeName } = useContext(AppContext);

  const containerRef = useRef(null);

  // Prevent default not working for wheel.
  // idk why. So we are using conditional horizontal scroll based on var:compact.
  const handleWheelCompact = compact
    ? (e) => (containerRef.current.scrollLeft += e.deltaY)
    : () => {}; // eat five star do noting.

  const { isFetching, error, data } = useQuery({
    queryKey: [themeName],
    queryFn: () => {
      if (themeName) {
        return getThemeColors(themeName);
      } else {
        return new Promise.resolve();
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast("can't fetch colors for the theme", { type: 'error' });
    }
  }, [error]);

  if (themeName === null) {
    return <div>choose a theme</div>;
  }

  if (isFetching) {
    return <Loader className={`${className ? className : ''}`} />;
  }

  if (error) {
    return (
      <div style={{ gridArea: 'colorcontainer' }} className="bg-red-950 p-2 text-gray-300">
        Something went wrong
      </div>
    );
  }

  let colorBadges = Object.entries(data.all).map(([key, value]) => {
    return <ColorBadge key={value} color={value} toolTipShowOnSide={!compact} />;
  });

  return (
    <div
      ref={containerRef}
      onWheel={handleWheelCompact}
      className={` ${compact ? 'h14 grid-flow-col grid-rows-1' : 'grid-flow-row grid-cols-2'} grid gap-1 overflow-x-hidden overflow-y-auto scroll-smooth bg-stone-800 p-1 sm:p-2`}
      style={{ gridArea: 'colorcontainer' }}
    >
      {colorBadges}
    </div>
  );
}

export function ColorBadge({ color, toolTipShowOnSide }) {
  const isBright = isBrightColor(color);
  return (
    <Draggable key={color} id={color}>
      <ToolTipWrap content="drag me into termninal" showOnSide={toolTipShowOnSide}>
        <div
          style={{ backgroundColor: color }}
          onClick={() => setIsThemePalateActive(true)}
          className={`${isBright ? 'text-black' : 'text-white'} cursor-pointer border border-indigo-300 px-1 py-5 text-center text-xs select-none`}
        >
          {color}
        </div>
      </ToolTipWrap>
    </Draggable>
  );
}
