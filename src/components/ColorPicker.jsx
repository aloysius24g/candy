import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from './AppState';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import {
    convertHexToHsv,
    convertHsvToHex,
    isBrightColor,
} from '../utils/colorsUtils';
import { useIsWide } from '../utils/responsive';

function ColorPicker({ className }) {
    const { termPalate, setTermPalate, colorPickerFor } =
        useContext(AppContext);

    const iswide = useIsWide();

    const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });
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

    return (
        <div
            className={'border-r-1 border-t-1 border-black overflow-auto p-1 flex flex-col gap-2 select-none'}
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
}

export default CustomPicker(ColorPicker);
