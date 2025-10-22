import { useContext } from 'react';
import { Button } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { SortableListItemContext } from './context';
import type { DragHandleProps } from './types';

// ============================================================================
// DRAG HANDLE COMPONENT
// ============================================================================

export const DragHandle: React.FC<DragHandleProps> = () => {
  const { setActivatorNodeRef, listeners, attributes } = useContext(SortableListItemContext);
  
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};
