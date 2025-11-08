import * as Tooltip from '@radix-ui/react-tooltip';

export default ({ children, props, content }) => {
	return (
		<Tooltip.Provider {...props}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						sideOffset={2}
						side="bottom"
						className="rounded-sm border border-black bg-stone-100 px-2 py-1 shadow-lg"
					>
						{content}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};
