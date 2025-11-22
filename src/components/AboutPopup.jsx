export default function AboutPopup() {
  return (
    <div
      className="mx-atuo container flex min-h-[60vh] flex-col items-center gap-3 overflow-auto border-1 border-gray-600 bg-neutral-900 p-3 text-indigo-200 md:w-[60vw]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h1 className="text-3xl font-bold">About</h1>
      <div className="mt-5 flex-grow-1 text-justify">
        Termcandy is a simple tool to customize terminal emulator's theme. This is a single page
        application writen in react.js. Terminal emulation is achieved using xterm.js library. This
        site will be usefull to rice terminal as an eyecandy, thus termcandy. I made this for my
        personal use then decided to host it. I am still working on support to more emulators,
        adding more themes and optimizing performance.
      </div>
      <div className="text-md mb-5">
        dev,contact:
        <span className="mx-2">
          <a className="font-bold hover:text-green-300" href="mailto:aloysius24@atomicmail.io">
            aloysius24@atomicmail.io
          </a>
        </span>
      </div>
    </div>
  );
}
