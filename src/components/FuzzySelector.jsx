import { useEffect, useRef, useState, useMemo } from "react"
import { SlMagnifier } from "react-icons/sl";

export default function FuzzySelector({ optionsArr, onChange, value }) {

	const [inputData, setInputData] = useState('');
	const [isSuggestionsOn, setIsSuggestionsOn] = useState(false);
	const [selectedOpt, setSelectedOpt] = useState('');
	const [focusIndexInMatch, setFocusIndexInMatch] = useState(0);

	const inputRef = useRef(null);
	const focusedOptionInMatchRef = useRef(null);
	const handleInputOnKeyDownRef = useRef(null);

	const handleInputOnChange = (event) => {
		setFocusIndexInMatch(0);
		setInputData(event.target.value);
	};
	const handleInputOnFocus = () => {
		setIsSuggestionsOn(true);
		let inputLength = inputRef.current.value.length;
		if(inputRef.current === document.activeElement) {
			inputRef.current.setSelectionRange(inputLength, inputLength);
		}
	};
	const inputFocusOff = () => {
		if(isSuggestionsOn) {
			setSelectedOpt(selectedOpt);
			setInputData(selectedOpt);
			setIsSuggestionsOn(false);
		}
	};
	const handleInputOnKeyDown = (event) => {
		if(event.key === 'Escape') {
			inputFocusOff();
		}
		if(event.key === 'Enter') {
			let matchedOption = matchedOptionsArr[focusIndexInMatch] || selectedOpt;
			setInputData(matchedOption);
			setSelectedOpt(matchedOption);
			setIsSuggestionsOn(false);
			inputRef.current.blur();
		}
		if(event.key === 'ArrowDown') {
			setFocusIndexInMatch(pre => (pre + 1) % matchedOptionsArr.length);
		}
		if(event.key === 'ArrowUp') {
			setFocusIndexInMatch(pre => (pre - 1 + matchedOptionsArr.length) % matchedOptionsArr.length);
		}
	}

	handleInputOnKeyDownRef.current = handleInputOnKeyDown;

	const prevApp = () => {
		let selIndex = optionsArr.indexOf(selectedOpt);
		if(selIndex === 0) {
			selIndex = optionsArr.length - 1;
		}else{
			selIndex--;
		}
		setSelectedOpt(optionsArr[selIndex]);
		setInputData(optionsArr[selIndex]);
	};
	const nextApp  = () => {
		let selIndex = optionsArr.indexOf(selectedOpt);
		if(selIndex === optionsArr.length - 1) {
			selIndex = 0
		}else{
			selIndex++;
		}
		setSelectedOpt(optionsArr[selIndex]);
		setInputData(optionsArr[selIndex]);
	};

	useEffect(() => {
		onChange({value: selectedOpt});
	},[selectedOpt]);

	useEffect(() => {
		setSelectedOpt(value);
		setInputData(value);
	},[value]);

	useEffect(() => {
		focusedOptionInMatchRef?.current?.scrollIntoView();
	},[focusIndexInMatch]);

	useEffect(() => {
		if(! isSuggestionsOn) {
			return;
		}
		const handleClickOut = (event) => {
			if(!inputRef.current.contains(event.target)) {
				focusOffFuncRef.current();
			}

		}
		const handleKeyDown = (event) => {
			handleInputOnKeyDownRef.current(event);
		}

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleClickOut);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleClickOut);
		}
	},[isSuggestionsOn]);

	const matchedOptionsArr = useMemo(() => optionsArr.filter((opt) => opt.includes(inputData.toLowerCase())),[inputData, optionsArr]);

	return <div className="flex relative justify-between">
		<button
			onClick={prevApp}
			className="px-2 border-y-2 border-l-2 border-black cursor-pointer hover:bg-red-500 hover:text-white"
		>
			&lt;
		</button>
		<div className="px-1 border-2 border-t-black focus:bg-red-500 focus:text-white flex justify-between gap-1 items-center cursor-pointer">
			<input
				ref={inputRef}
				type="text" 
				onFocus={handleInputOnFocus} 
				onChange={handleInputOnChange}
				className="w-20 focus:outline-none cursor-pointer"
				value={inputData}
			>
			</input>
			<SlMagnifier />
		</div>
		{isSuggestionsOn && 
			<div 
				className="overflow-y-auto max-h-40 bg-white flex flex-col w-full divide-y divide-black absolute z-20 top-[105%]"
			>
				{
					matchedOptionsArr.map((opt, index) => 
						<button 
							ref={focusIndexInMatch === index ? focusedOptionInMatchRef : null}
							value={index}
							key={index} 
							onClick={() => {
								setSelectedOpt(opt);
								setInputData(opt);
								setIsSuggestionsOn(false);
							}}
							onMouseEnter={() => setFocusIndexInMatch(index)}
							className={`${focusIndexInMatch === index && 'bg-indigo-200'} cursor-pointer`}
						>
							{opt}
						</button>
					)
				}
			</div>
		}
		<button
			onClick={nextApp}
			className="px-2 border-y-2 border-r-2 border-black cursor-pointer hover:bg-red-500 hover:text-white"
		>
			&gt;
		</button>
	</div>
}
