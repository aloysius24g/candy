import { useContext } from 'react';
import { AppContext } from './AppState';

export default function TerminalPalate({ className }) {
  const { colorPickerFor, setColorPickerFor, termPalate, setTermPalate } = useContext(AppContext);

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

  const handelClickWraper = (event) => {
    event.stopPropagation();
  };

  const handleDragOverPalate = (event) => {
    event.preventDefault();
  };

  const handleClickPalate = (event, colorName) => {
    setColorPickerFor(colorName);
  };

  const handleDropPalate = (event, colorName) => {
    event.preventDefault();
    let data = event.dataTransfer.getData('color');
    if (!data) {
      return;
    }
    setTermPalate((prevThemePalate) => ({
      ...prevThemePalate,
      [colorName]: data,
    }));
    setColorPickerFor(colorName);
  };
  const handleTouchEnd = (colorName) => {
    const color = window.touchDragColor;
    if (!color) {
      return;
    }
    setTermPalate((prevThemePalate) => ({
      ...prevThemePalate,
      [colorName]: color,
    }));
    setColorPickerFor(colorName);
  };

  return (
    <div
      onClick={handelClickWraper}
      className={`${className ? className : ''} grid grid-cols-9 p-3 text-center text-nowrap text-indigo-300`}
    >
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Fg-Bg
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Black
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">Red</span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Green
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Yellow
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Blue
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Magenta
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        Cyan
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto sm:rotate-0">
        White
      </span>

      {colorNames.map((colorName) => {
        return (
          <div
            onClick={(event) => handleClickPalate(event, colorName)}
            key={colorName}
            onDragOver={handleDragOverPalate}
            onTouchMove={handleDragOverPalate}
            onDrop={(event) => {
              handleDropPalate(event, colorName);
            }}
            onTouchEnd={() => {
              handleTouchEnd(colorName);
            }}
            className={`${colorName === colorPickerFor ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/50' : ''} h-15 content-center select-none`}
            style={{ backgroundColor: termPalate?.[colorName] }}
          >
            {termPalate[colorName] ? '' : 'Choose'}
          </div>
        );
      })}
    </div>
  );
}
