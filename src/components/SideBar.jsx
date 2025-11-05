import PalateContainer from './PalateContainer';

export default function SideBar({ colorsJson }) {
  <>
    <img src="" alt="logo" />
    <PalateContainer
      wrapClass="col-span-1 grid grid-cols-2 gap-2 overflow-auto px-5"
      colorsJson={colorsJson}
    />
  </>;
}
