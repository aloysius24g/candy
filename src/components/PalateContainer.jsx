import { useContext, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from './AppState';
import { isBrightColor } from '../utils/colorsUtils';
import Loader from './Loader';
import { getThemeColors } from '../utils/dataFetch';
import { toast } from 'react-toastify';
import ToolTipWrap from './ToolTipWrap';

export default function PalateContainer({ className, compact }) {
  const { themeName, setIsThemePalateActive } = useContext(AppContext);

  const containerRef = useRef(null);

  // Prevent default not working for wheel.
  // idk why. So we are using conditional horizontal scroll based on var:compact.
  const handleWheelCompact = compact
    ? (e) => (containerRef.current.scrollLeft += e.deltaY)
    : () => {}; // eat five star do noting.

  const { isFetching, refetch, error, data } = useQuery({
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

  const handleDrag = (event, value) => {
    event.dataTransfer.setData('color', value);
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleTouchStart = (value) => {
    window.touchDragColor = value;
  };
  let colorBadges = Object.entries(data.all).map(([key, value]) => {
    let isBright = isBrightColor(value);
    return (
      <ToolTipWrap key={key} content="drag me into termninal" showOnSide={!compact}>
        <div
          key={key}
          onClick={() => setIsThemePalateActive(true)}
          onDragStart={(event) => handleDrag(event, value)}
          onTouchStart={() => handleTouchStart(value)}
          className={`${isBright ? 'text-black' : 'text-white'} cursor-pointer border border-indigo-300 px-1 py-5 text-center text-xs select-none`}
          style={{ backgroundColor: value }}
          draggable
        >
          {value}
        </div>
      </ToolTipWrap>
    );
  });

  return (
    <div
      ref={containerRef}
      onWheel={handleWheelCompact}
      className={` ${compact ? 'grid-flow-col grid-rows-1' : 'grid-flow-row grid-cols-2'} grid gap-1 overflow-y-auto scroll-smooth bg-stone-800 p-2`}
      style={{ gridArea: 'colorcontainer' }}
    >
      {colorBadges}
    </div>
  );
}
