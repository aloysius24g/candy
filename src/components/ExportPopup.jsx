import { useState, useContext } from 'react';
import genConfig from '../utils/genConfigUtil';

import { AppContext } from './AppState';

export default function ExportPopup() {
  const terminalsList = [
    'rxvt',
    'json',
    'alacritty',
    'putty',
    'linux console',
    'konsole',
  ];

  const { termPalate } = useContext(AppContext);
  const [termType, setTermType] = useState(terminalsList[0]);
  return (
    <div
      className="grid h-[60vh] w-[80vw] grid-rows-8 bg-white sm:w-[60vw]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="row-span-1 flex w-full flex-row justify-between bg-stone-300 px-3">
        <div className="flex">
          <label className="mx-3 content-center">Terminal</label>
          <select
            value={termType}
            onChange={(event) => setTermType(event.target.value)}
          >
            {terminalsList.map((terminal) => (
              <option key={terminal} value={terminal}>
                {terminal}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() =>
            navigator.clipboard.writeText(genConfig(termType, termPalate))
          }
        >
          Copy
        </button>
      </div>
      <div className="row-span-7 grid grid-rows-8 overflow-hidden p-2">
        <div className="row-span-1 rounded bg-violet-300 p-2 text-center text-green-700">
          Config templates tak(stol)en from{' '}
          <a
            href="https://terminal.sexy"
            className="text-red-500 italic underline"
          >
            terminal.sexy
          </a>
        </div>
        <pre className="row-span-7 overflow-auto font-mono">
          {genConfig(termType, termPalate)}
        </pre>
      </div>
    </div>
  );
}
