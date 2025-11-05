import { useContext } from 'react';
import TerminalView from './components/TerminalView';
import PalateContainer from './components/PalateContainer';
import TerminalBar from './components/TerminalBar';
import { AppContext } from './components/AppState';
import ColorPicker from './components/ColorPicker';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { useIsWide } from './utils/responsive';

function App() {
  const isWide = useIsWide();

  let gridLayout;

  if (isWide) {
    gridLayout = {
      gridTemplateAreas: `
				"logo           sitebar     "
				"colorcontainer terminalview"
				"colorpicker    terminalview"
			`,
      gridTemplateColumns: '1fr 6fr',
      gridTemplateRows: '10fr, 5fr, 3fr',
    };
  } else {
    gridLayout = {
      gridTemplateAreas: `
				"logo           sitebar       "
				"terminalview   terminalview  "
				"colorpicker    colorcontainer"
			`,
      gridTemplateColumns: '2fr 8fr',
      gridTemplateRows: '1fr, 7fr, 1fr',
    };
  }

  return (
    <>
      <ReactQueryDevtools />
      <div
        className="grid h-screen overflow-hidden"
        style={{
          gridTemplateAreas: gridLayout.gridTemplateAreas,
          gridTemplateColumns: gridLayout.gridTemplateColumns,
          gridTemplateRows: gridLayout.gridTemplateRows,
        }}
      >
        <span className="content-center border-r-1 border-b-1 border-black px-2 text-center font-mono text-lg font-bold text-nowrap uppercase">
          terminal ugly
        </span>
        <PalateContainer className="grid grid-flow-col grid-cols-1 gap-1 overflow-y-auto p-1 md:grid-flow-row md:grid-cols-2 md:gap-2" />
        <ColorPicker compact={isWide ? false : true} />
        <TerminalBar />
        <TerminalView />
      </div>
    </>
  );
}

export default App;
