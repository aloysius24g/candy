import { useContext } from 'react';
import { AppContext } from './AppState';
import { useDndContext, useDroppable } from '@dnd-kit/core';

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

  const handleClickPalate = (colorName) => {
    setColorPickerFor(colorName);
  };

  return (
    <div
      onClick={handelClickWraper}
      className={`${className ? className : ''} grid grid-cols-9 p-3 text-center text-nowrap text-indigo-300`}
    >
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Fg-Bg
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Black
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">Red</span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Green
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Yellow
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Blue
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Magenta
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        Cyan
      </span>
      <span className="mb-2 h-15 rotate-270 content-center sm:mb-8 sm:h-auto md:rotate-0">
        White
      </span>

      {colorNames.map((colorName) => {
        return (
          <div
            onClick={() => handleClickPalate(colorName)}
            key={colorName}
            className={`${colorName === colorPickerFor ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/50' : ''} relative h-15 content-center select-none`}
            style={{ backgroundColor: termPalate?.[colorName] }}
          >
            {termPalate[colorName] ? '' : 'Choose'}
            <DroppableZone id={colorName} />
            <div className="absolute inset-0"></div>
          </div>
        );
      })}
    </div>
  );
}

function DroppableZone({ id }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      accepts: ['color'],
    },
  });
  const { active } = useDndContext();

  let hoveredWithColor = null;
  if (isOver && active.data.current.type === 'color') {
    hoveredWithColor = active.id;
  }

  return (
    <div
      className={`absolute inset-0 ${hoveredWithColor && 'z-50'}`}
      style={{ backgroundColor: hoveredWithColor }}
      ref={setNodeRef}
    ></div>
  );
}
