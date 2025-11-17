import { useContext, useEffect, useState, useRef } from 'react';
import FuzzySelector from './FuzzySelector';
import { CgColorPicker } from 'react-icons/cg';
import Popup from './Popup';
import { AppContext } from './AppState';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import { convertHexToHsv, convertHsvToHex, isBrightColor } from '../utils/colorsUtils';
import { useIsWide } from '../utils/responsive';
import { AnimatePresence } from 'framer-motion';

function ColorPicker({ className, compact }) {
  const colorNames = [
    'foreground',
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'background',
    'brightBlack',
    'brightRed',
    'brightGreen',
    'brightYellow',
    'brightBlue',
    'brightMagenta',
    'brightCyan',
    'brightWhite',
  ];

  const { termPalate, setTermPalate, colorPickerFor, setColorPickerFor, setIsThemePalateActive } =
    useContext(AppContext);

  const iswide = useIsWide();

  const lastHue = useRef(0);
  const [compactPopup, setCompactPopup] = useState(false);

  let color = termPalate[colorPickerFor];

  useEffect(() => {
    if (!compact) {
      setCompactPopup(false);
    }
  }, [compact]);

  if (!color) {
    color = '#000';
  }
  const hsv = convertHexToHsv(color);
  const realTimeHue = hsv.h;
  // Restore Hue state.
  // But only when previous render's hue differs current by a resonable amount
  // To reduce conversion error.
  if (isNaN(hsv.h) || Math.abs(lastHue.current - hsv.h) <= 10) {
    hsv.h = lastHue.current;
  }

  const handleValueChange = (value) => {
    setTermPalate((prevThemePalate) => {
      return {
        ...prevThemePalate,
        [colorPickerFor]: value,
      };
    });
  };

  const handleHueChange = (value) => {
    let tHsv = {
      ...hsv,
      h: value.h,
    };
    // To make track of hue value. Usefull when the color has no Hue.
    // Like black, gray.
    lastHue.current = tHsv.h;
    let tColor = convertHsvToHex(tHsv);
    handleValueChange(tColor);
  };
  const handleSaturationChange = (value) => {
    let tHsv = {
      ...hsv,
      s: value.s,
      v: value.v,
    };
    let tColor = convertHsvToHex(tHsv);
    handleValueChange(tColor);
  };

  let currentColor = termPalate[colorPickerFor] ? termPalate[colorPickerFor] : '#000000';

  const colorPicker = (
    <div
      className={`flex flex-col gap-3 overflow-y-auto bg-stone-900 ${!compact && 'border-t border-t-gray-500'} p-2 select-none`}
      style={{ gridArea: 'colorpicker' }}
    >
      <FuzzySelector
        className=""
        optionsArr={colorNames}
        onChange={setColorPickerFor}
        value={colorPickerFor}
      />
      <div className="relative h-3 flex-shrink-0">
        <Hue hsl={hsv} onChange={handleHueChange} direction="horizontal" />
      </div>
      <div className="relative min-h-30 flex-shrink-0 flex-grow-4 border-1 border-indigo-200">
        <Saturation hsv={hsv} hsl={hsv} onChange={handleSaturationChange} />
      </div>
      <div
        style={{ backgroundColor: currentColor }}
        className={`relative content-center text-center ${isBrightColor(currentColor) ? 'text-black' : 'text-white'}`}
      >
        {colorPickerFor}
        <br />
        {currentColor}
      </div>
    </div>
  );
  if (!compact) {
    return colorPicker;
  }
  return (
    <>
      <button
        className={`flex cursor-pointer items-center justify-center bg-stone-800 text-white`}
        style={{ gridArea: 'colorpicker' }}
        onClick={() => {
          setCompactPopup(true);
          // close the terminal palate popup.
          setIsThemePalateActive(false);
        }}
      >
        <CgColorPicker className="text-xl text-cyan-500" />
      </button>
      <AnimatePresence>
        {compactPopup && (
          <Popup closeCb={() => setCompactPopup(false)} noBlur>
            <div
              className="z-60 flex h-[60vh] w-[50vh] flex-col justify-center gap-2 rounded-md border-1 border-gray-600 bg-neutral-900 p-8 text-indigo-200 sm:w-[60vw]"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {colorPicker}
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </>
  );
}

export default CustomPicker(ColorPicker);
