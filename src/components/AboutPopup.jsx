export default function AboutPopup() {
  return (
    <div
      className="flex min-h-[60vh] w-[80vw] flex-col items-center gap-3 overflow-auto border-1 border-gray-600 bg-neutral-900 p-3 text-indigo-200 md:w-[60vw]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h1 className="text-3xl font-bold">About</h1>
      <div className="mt-5 flex-grow-1 text-justify">
        This is a simple tool to customize terminal emulator's theme. This is a single page
        application writen in react.js. Terminal emulation is achieved using xterm.js library. This
        site will be usefull for making the terminal an eyecandy, thus termcandy.
      </div>
      <div className="mb-5">dev,contact: aloysius24@atomicmail.io</div>
    </div>
  );
}
