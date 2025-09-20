// client/src/components/dashboard/TaskBoard.jsx

import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const ItemTypes = {
  TASK: 'task',
};

const Column = ({ title, status, tasks, onDropTask, onSelectTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors ${
        isOver ? 'bg-blue-100 dark:bg-blue-900/30' : ''
      }`}
      style={{ minWidth: '280px' }}
    >
      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">{title}</h3>
      
      <div className="space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onSelectTask={onSelectTask} />
        ))}
      </div>
    </div>
  );
};

const TaskBoard = ({ tasks, onDropTask, onAddTask, onSelectTask, loading,isOwner }) => {
  const columns = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      'in-progress': tasks.filter((t) => t.status === 'in-progress'),
      completed: tasks.filter((t) => t.status === 'completed'),
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Top bar with global Add Task button */}
      <div className="flex justify-end">
        <button
          onClick={() => onAddTask('todo')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[300px]">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Column
              title="To-Do"
              status="todo"
              tasks={columns.todo}
              onDropTask={onDropTask}
              onSelectTask={onSelectTask}
              isOwner={isOwner}
            />
            <Column
              title="In Progress"
              status="in-progress"
              tasks={columns['in-progress']}
              onDropTask={onDropTask}
              onSelectTask={onSelectTask}
              isOwner={isOwner}
            />
            <Column
              title="Completed"
              status="completed"
              tasks={columns.completed}
              onDropTask={onDropTask}
              onSelectTask={onSelectTask}
              isOwner={isOwner}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
