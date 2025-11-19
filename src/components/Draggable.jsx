import { useDraggable } from '@dnd-kit/core';

export default function Draggable(props) {
  const Element = props.element || 'div';
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    data: {
      type: 'color',
    },
  });

  return (
    <Element
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
    >
      {props.children}
    </Element>
  );
}
