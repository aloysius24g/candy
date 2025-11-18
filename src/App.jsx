import TerminalView from './components/TerminalView';
import PalateContainer from './components/PalateContainer';
import TerminalBar from './components/TerminalBar';
import ColorPicker from './components/ColorPicker';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer, Slide, toast } from 'react-toastify';
import { useIsWide } from './utils/responsive';
import { useEffect } from 'react';

function App() {
  const isWide = useIsWide();

  useEffect(() => {
    if (!isWide) {
      toast.warn('please view in desktop for best experience');
    }
  }, []);

  let gridLayout;

  if (isWide) {
    gridLayout = {
      gridTemplateAreas: `
				"sitebar           sitebar     "
				"colorcontainer terminalview"
				"colorpicker    terminalview"
			`,
      gridTemplateColumns: '1fr 6fr',
      gridTemplateRows: 'auto 5fr 4fr',
    };
  } else {
    gridLayout = {
      gridTemplateAreas: `
				"sitebar           sitebar       "
				"terminalview   terminalview  "
				"colorpicker    colorcontainer"
			`,
      gridTemplateColumns: '1fr 8fr',
      gridTemplateRows: 'auto 7fr auto',
    };
  }

  return (
    <>
      <ReactQueryDevtools />
      <div
        className="grid h-svh overflow-hidden bg-black text-cyan-300"
        style={{
          gridTemplateAreas: gridLayout.gridTemplateAreas,
          gridTemplateColumns: gridLayout.gridTemplateColumns,
          gridTemplateRows: gridLayout.gridTemplateRows,
        }}
      >
        <TerminalBar />
        <PalateContainer compact={!isWide} />
        <ColorPicker compact={!isWide} />
        <TerminalView />
      </div>
      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastClassName="w-30 bg-neutral-900 border-1 border-gray-600"
        transition={Slide}
        limit={2}
      />
    </>
  );
}

export default App;
