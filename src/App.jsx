import TerminalView from './components/TerminalView';
import PalateContainer, { ColorBadge } from './components/PalateContainer';
import TerminalBar from './components/TerminalBar';
import ColorPicker from './components/ColorPicker';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer, Slide, toast } from 'react-toastify';
import { useIsWide } from './utils/responsive';
import { useContext, useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { AppContext } from './components/AppState';

function App() {
  const isWide = useIsWide();

  const [activeDraggableColor, setActiveDraggableColor] = useState(null);

  const { setColorPickerFor, setTermPalate } = useContext(AppContext);

  const dropEndHandler = (e) => {
    const { active, over } = e;
    if (!over) {
      return;
    }
    // check if its a color drop
    if (active.data.current.type === 'color' && over.data.current.accepts.includes('color')) {
      setColorPickerFor(over.id);
      setTermPalate((pre) => ({ ...pre, [over.id]: active.id }));
      setActiveDraggableColor(null);
    }
  };

  // make a sensor to make the touch screen wait for some time before triggering
  // a drag on draggable.
  // In futrue do some design pattern to seperate this logic in a different component.
  const pointerSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 100,
    },
  });
  const sensor = useSensors(pointerSensor, touchSensor);

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
        <DndContext
          sensors={sensor}
          onDragStart={(e) => setActiveDraggableColor(e.active.id)}
          onDragEnd={dropEndHandler}
          measuring={{ droppable: { strategy: MeasuringStrategy.BeforeDragging } }}
        >
          <PalateContainer compact={!isWide} />
          <TerminalView />
          <DragOverlay>
            {activeDraggableColor ? <ColorBadge color={activeDraggableColor} /> : null}
          </DragOverlay>
        </DndContext>
        <ColorPicker compact={!isWide} />
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
