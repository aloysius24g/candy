import { useContext, useEffect } from 'react';
import { AppContext } from './AppState';

export default function TerminalPalate({ className }) {
    const {
        themeName,
        colorPickerFor,
        setColorPickerFor,
        termPalate,
        setTermPalate,
    } = useContext(AppContext);

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
        let data = event.dataTransfer.getData('dragData');
        setTermPalate((prevThemePalate) => ({
            ...prevThemePalate,
            [colorName]: data,
        }));
        setColorPickerFor(colorName);
    };
    return (
        <div
            onClick={handelClickWraper}
            className={`${className ? className : ''} grid grid-cols-9 bg-white p-3 text-center text-nowrap`}
        >
            <span className="py-1">Fg-Bg</span>
            <span className="overflow-hidden">Black</span>
            <span className="overflow-hidden">Red</span>
            <span className="overflow-hidden">Green</span>
            <span className="overflow-hidden">Yellow</span>
            <span className="overflow-hidden">Blue</span>
            <span className="overflow-hidden">Magenta</span>
            <span className="overflow-hidden">Cyan</span>
            <span className="overflow-hidden">White</span>

            {colorNames.map((colorName) => {
                return (
                    <div
                        onClick={(event) => handleClickPalate(event, colorName)}
                        key={colorName}
                        onDragOver={handleDragOverPalate}
                        onDrop={(event) => {
                            handleDropPalate(event, colorName);
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
