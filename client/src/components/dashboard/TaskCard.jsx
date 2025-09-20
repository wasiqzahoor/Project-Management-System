import React from 'react';
import { useDrag } from 'react-dnd';

// Is line ko humne hata diya hai: import { Badge } from '../ui/Badge';

const ItemTypes = {
  TASK: 'task',
};

const TaskCard = ({ task, onSelectTask ,isOwner}) => { 
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task._id, status: task.status },
    canDrag: isOwner,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  };
 const cursorStyle = isOwner ? 'cursor-grab active:cursor-grabbing' : 'cursor-default';
  return (
     <div
      ref={drag}
      onClick={() => onSelectTask(task)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
     className={`bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow ${cursorStyle}`} >
      <p className="font-semibold text-gray-800 dark:text-white mb-2">{task.title}</p>
      
      <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${priorityColors[task.priority]}`}>
        {task.priority}
      </div>
    </div>
  );
};

export default TaskCard;