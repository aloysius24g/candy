import { useState, useContext } from 'react';
import genConfig from '../utils/genConfigUtil';
import { toast } from 'react-toastify';
import { LuCopy } from 'react-icons/lu';

import { AppContext } from './AppState';

export default function ExportPopup() {
  const terminalsList = ['rxvt', 'json', 'alacritty', 'putty', 'linux console', 'konsole'];

  const { termPalate } = useContext(AppContext);
  const [termType, setTermType] = useState(terminalsList[0]);

  return (
    <div
      className="grid h-[60vh] w-[80vw] grid-rows-8 border-1 border-gray-600 bg-neutral-900 p-2 sm:w-[60vw]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="row-span-1 flex w-full flex-row justify-between border-b-1 border-b-gray-600 bg-stone-800 px-1 sm:px-3">
        <div className="flex">
          <label className="content-center">Emu</label>
          <select
            className="self-center border-1 border-gray-600 p-1 text-indigo-200 focus:border-indigo-400 focus:outline-none"
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
          className="flex cursor-pointer items-center"
          onClick={() =>
            navigator.clipboard
              .writeText(genConfig(termType, termPalate))
              .then(() => toast.success('configuration copied'))
              .catch(() => toast.error("can't copy", { type: 'error' }))
          }
        >
          <LuCopy className="inline text-xl" />
          <span className="">Copy</span>
        </button>
      </div>
      <div className="row-span-7 grid grid-rows-7 overflow-hidden bg-neutral-800 p-2">
        <pre className="row-span-7 overflow-auto font-mono text-indigo-200">
          {genConfig(termType, termPalate)}
        </pre>
      </div>
    </div>
  );
}
