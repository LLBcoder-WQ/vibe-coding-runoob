import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasStoredTasks, loadTasks, saveTasks } from '../utils/storage'

function createSampleTasks(): Task[] {
  const today = new Date().toISOString().slice(0, 10)

  return [
    {
      id: 'sample-task-1',
      title: '梳理产品需求与页面结构',
      description: '明确任务管理流程，整理核心页面和交互。',
      status: 'in-progress',
      priority: 'high',
      dueDate: today,
      createdAt: today,
    },
    {
      id: 'sample-task-2',
      title: '搭建 Vue 项目基础骨架',
      description: '配置应用入口、基础样式和组件目录。',
      status: 'todo',
      priority: 'medium',
      dueDate: today,
      createdAt: today,
    },
    {
      id: 'sample-task-3',
      title: '规划本周的开发任务',
      description: '拆分后续功能，安排合理的实现顺序。',
      status: 'done',
      priority: 'low',
      dueDate: today,
      createdAt: today,
    },
  ]
}

const initialTasks = hasStoredTasks() ? loadTasks() : createSampleTasks()

export const taskStore = reactive({
  tasks: initialTasks,
})

watch(
  () => taskStore.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  taskStore.tasks.unshift(task)
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const task = taskStore.tasks.find((item) => item.id === id)
  if (task) {
    Object.assign(task, updates)
  }
}

export function deleteTask(id: string): void {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === id)
  if (taskIndex !== -1) {
    taskStore.tasks.splice(taskIndex, 1)
  }
}
