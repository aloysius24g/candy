import { useContext, useEffect, useState, useRef } from 'react';
import FuzzySelector from './FuzzySelector';
import * as Select from '@radix-ui/react-select';
import Popup from './Popup';
import { AppContext } from './AppState';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import { convertHexToHsv, convertHsvToHex, isBrightColor } from '../utils/colorsUtils';
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

	const { termPalate, setTermPalate, colorPickerFor, setColorPickerFor } = useContext(AppContext);

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

	let currentColor = termPalate[colorPickerFor] ? termPalate[colorPickerFor] : '#000000';

	const colorPicker = (
		<div
			className={`flex flex-col gap-2 overflow-auto rounded-md bg-stone-900 p-1 p-2 select-none`}
			style={{ gridArea: 'colorpicker' }}
		>
			<div className="relative h-3">
				<Hue hsl={hsv} onChange={handleHueChange} direction="horizontal" />
			</div>
			<div className="relative h-30 border-1 border-indigo-200">
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
				className={`mb-1 ml-1 cursor-pointer rounded-sm border border-black bg-red-700 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white`}
				style={{ gridArea: 'colorpicker' }}
				onClick={() => setCompactPopup(true)}
			>
				Pick color
			</button>
			{compactPopup && (
				<Popup closeCb={() => setCompactPopup(false)} noBlur>
					<div
						className="flex h-[50vh] w-[50vh] flex-col justify-center gap-2 rounded-md border-1 border-gray-600 bg-neutral-900 p-8 text-indigo-200 sm:w-[60vw]"
						onClick={(event) => {
							event.stopPropagation();
							setOpaqe(false);
						}}
					>
						<div className="flex items-center justify-between">
							<label className="block">Color:</label>
							<FuzzySelector
								//Icon={PiTerminalBold}
								className="w-50"
								optionsArr={colorNames}
								onChange={setColorPickerFor}
								value={colorPickerFor}
							/>
						</div>
						{colorPicker}
					</div>
				</Popup>
			)}
		</>
	);
}

export default CustomPicker(ColorPicker);
