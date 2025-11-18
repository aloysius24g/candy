import * as Tooltip from '@radix-ui/react-tooltip';

export default function ToolTipWrap({ children, content, showOnSide }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={2}
            side={showOnSide ? 'right' : 'bottom'}
            className="max-w-50 rounded-sm border border-gray-500 bg-neutral-900 px-2 py-1 text-sm text-white shadow-lg"
          >
            <Tooltip.Arrow className="fill-gray-500" />
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
