import { useContext, useEffect, useState, useRef } from 'react';
import FuzzySelector from './FuzzySelector';
import * as Select from '@radix-ui/react-select';
import Popup from './Popup';
import { AppContext } from './AppState';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import {
    convertHexToHsv,
    convertHsvToHex,
    isBrightColor,
} from '../utils/colorsUtils';
import { useIsWide } from '../utils/responsive';

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

    const { termPalate, setTermPalate, colorPickerFor, setColorPickerFor } =
        useContext(AppContext);

    const iswide = useIsWide();

    const [opaqe, setOpaqe] = useState(true);
    const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });
    const [compactPopup, setCompactPopup] = useState(false);
    const hsvRef = useRef(hsv);

    useEffect(() => {
        let tCol;
        if (!termPalate[colorPickerFor]) {
            tCol = '#000000'; // choose black if the terminal palate color is undefined
        } else {
            tCol = termPalate[colorPickerFor];
        }
        let tHsv = convertHexToHsv(tCol);
        setHsv(tHsv);
    }, [colorPickerFor, termPalate]);

    const handleHueChange = (event) => {
        let tHsv = {
            ...hsv,
            h: event.h,
        };
        let tColor = convertHsvToHex(tHsv);
        setHsv(tHsv);
        setTermPalate((prevThemePalate) => {
            return {
                ...prevThemePalate,
                [colorPickerFor]: tColor,
            };
        });
    };
    const handleSaturationChange = (event) => {
        let tHsv = {
            ...hsv,
            s: event.s,
            v: event.v,
        };
        let tColor = convertHsvToHex(tHsv);
        setHsv(tHsv);
        setTermPalate((prevThemePalate) => {
            return {
                ...prevThemePalate,
                [colorPickerFor]: tColor,
            };
        });
    };

    let currentColor = termPalate[colorPickerFor]
        ? termPalate[colorPickerFor]
        : '#000000';

    const colorPicker = (
        <div
            className={'flex flex-col gap-2 overflow-auto p-1 select-none'}
            style={{ gridArea: 'colorpicker' }}
        >
            <div className="relative h-3">
                <Hue
                    hsl={hsv}
                    onChange={handleHueChange}
                    direction="horizontal"
                />
            </div>
            <div className="relative h-30">
                <Saturation
                    hsv={hsv}
                    hsl={hsv}
                    onChange={handleSaturationChange}
                />
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
                className="m-1 cursor-pointer rounded-sm border border-black bg-red-700 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                style={{ gridArea: 'colorpicker' }}
                onClick={() => setCompactPopup(true)}
            >
                Customize Palate
            </button>
            {compactPopup && (
                <Popup closeCb={() => setCompactPopup(false)} noBlur>
                    <div
                        className="flex h-[50vh] w-[50vh] flex-col justify-center bg-white p-8 sm:w-[60vw]"
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpaqe(false);
                        }}
                    >
                        <div className="flex justify-between">
                            <label className="block">Select For:</label>
                            <Select.Root
                                defaultValue={colorNames[0]}
                                onValueChange={(value) =>
                                    setColorPickerFor(value)
                                }
                            >
                                <Select.Trigger asChild>
                                    <button className="p-1 outline-1">
                                        {colorPickerFor}
                                    </button>
                                </Select.Trigger>
                                <Select.Content className="z-40 bg-white">
                                    <Select.Viewport>
                                        {colorNames.map((colorName) => (
                                            <Select.Item
                                                key={colorName}
                                                value={colorName}
                                            >
                                                {colorName}
                                            </Select.Item>
                                        ))}
                                    </Select.Viewport>
                                </Select.Content>
                            </Select.Root>
                        </div>
                        {colorPicker}
                    </div>
                </Popup>
            )}
        </>
    );
}

export default CustomPicker(ColorPicker);
