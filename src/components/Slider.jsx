import * as RadixSlider from '@radix-ui/react-slider';

export default function Slider({ value, onChange, defaultValue, min, max, step }) {
  return (
    <RadixSlider.Root
      className="relative flex h-5 w-[200px] cursor-pointer touch-none items-center select-none"
      defaultValue={defaultValue}
      value={value}
      max={max}
      min={min}
      step={step}
      onValueChange={onChange}
    >
      <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-600">
        <RadixSlider.Range className="absolute h-full rounded-full bg-indigo-300" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block size-4 cursor-grab rounded-[10px] bg-gray-300 hover:bg-white focus:bg-cyan-300 focus:outline-none" />
    </RadixSlider.Root>
  );
}
