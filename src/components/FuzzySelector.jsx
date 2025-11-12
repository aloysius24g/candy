import { useEffect, useRef, useState, useMemo } from 'react';
import { SlMagnifier } from 'react-icons/sl';

export default function FuzzySelector({ optionsArr, onChange, value, Icon, className }) {
  const [inputData, setInputData] = useState('');
  const [isSuggestionsOn, setIsSuggestionsOn] = useState(false);
  const [focusIndexInMatch, setFocusIndexInMatch] = useState(0);

  const inputRef = useRef(null);
  const focusedOptionInMatchRef = useRef(null);
  const handleInputOnKeyDownRef = useRef(null);

  const handleInputOnChange = (event) => {};
  const handleInputOnFocus = () => {
    setIsSuggestionsOn(true);
    let inputLength = inputRef.current.value.length;
    if (inputRef.current === document.activeElement) {
      inputRef.current.setSelectionRange(inputLength, inputLength);
    }
  };

  const handleInputOnKeyDown = (event) => {
    if (event.key === 'Escape') {
      console.log('hehe');
      onChange(value);
      setInputData(value);
      setIsSuggestionsOn(false);
    }
    if (event.key === 'Enter') {
      let matchedOption = matchedOptionsArr[focusIndexInMatch] || selectedOpt;
      setInputData(matchedOption);
      onChange(matchedOption);
      setIsSuggestionsOn(false);
    }
    if (event.key === 'ArrowDown') {
      setFocusIndexInMatch((pre) => (pre + 1) % matchedOptionsArr.length);
    }
    if (event.key === 'ArrowUp') {
      setFocusIndexInMatch(
        (pre) => (pre - 1 + matchedOptionsArr.length) % matchedOptionsArr.length,
      );
    }
  };

  handleInputOnKeyDownRef.current = handleInputOnKeyDown;

  const prevApp = () => {
    let selIndex = optionsArr.indexOf(value);
    if (selIndex === 0) {
      selIndex = optionsArr.length - 1;
    } else {
      selIndex--;
    }
    onChange(optionsArr[selIndex]);
    setInputData(optionsArr[selIndex]);
  };
  const nextApp = () => {
    let selIndex = optionsArr.indexOf(value);
    if (selIndex === optionsArr.length - 1) {
      selIndex = 0;
    } else {
      selIndex++;
    }
    onChange(optionsArr[selIndex]);
    setInputData(optionsArr[selIndex]);
  };

  // Resets the focus to first element on input change.
  useEffect(() => {
    setFocusIndexInMatch(0);
  }, [inputData]);

  useEffect(() => {
    setInputData(value);
  }, [value]);

  useEffect(() => {
    focusedOptionInMatchRef?.current?.scrollIntoView();
  }, [focusIndexInMatch]);

  useEffect(() => {
    if (!isSuggestionsOn) {
      return;
    }
    const handleClickOut = (event) => {
      if (!inputRef.current.contains(event.target)) {
        focusOffFuncRef.current();
      }
    };
    const handleKeyDown = (event) => {
      handleInputOnKeyDownRef.current(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOut);
    };
  }, [isSuggestionsOn]);

  const matchedOptionsArr = useMemo(
    () => optionsArr.filter((opt) => opt.includes(inputData.toLowerCase())),
    [inputData, optionsArr],
  );

  return (
    <div className={`${className ? className : ''} relative flex justify-center`}>
      <button
        onClick={prevApp}
        className="cursor-pointer border-y-1 border-l-1 border-gray-600 px-2 hover:bg-cyan-500 hover:text-white"
      >
        &lt;
      </button>
      <div className="flex cursor-pointer items-center justify-between gap-1 border-1 border-gray-600 px-1">
        <input
          ref={inputRef}
          type="text"
          onFocus={handleInputOnFocus}
          onChange={(e) => setInputData(e.target.value)}
          className="w-4/5 cursor-pointer text-indigo-200 focus:outline-none"
          value={inputData}
        ></input>
        {Icon && <Icon />}
      </div>
      {isSuggestionsOn && (
        <div className="absolute top-[105%] z-20 flex max-h-40 w-full flex-col divide-y divide-black overflow-y-auto border-1 border-gray-600 bg-neutral-900">
          {matchedOptionsArr.map((opt, index) => (
            <button
              ref={focusIndexInMatch === index ? focusedOptionInMatchRef : null}
              value={index}
              key={index}
              onClick={() => {
                onChange(opt);
                setInputData(opt);
                setIsSuggestionsOn(false);
              }}
              onMouseEnter={() => setFocusIndexInMatch(index)}
              className={` ${focusIndexInMatch === index ? 'bg-gray-800 text-gray-200' : 'text-gray-400'} cursor-pointer`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={nextApp}
        className="cursor-pointer border-y-1 border-r-1 border-gray-600 px-2 hover:bg-cyan-500 hover:text-white"
      >
        &gt;
      </button>
    </div>
  );
}
