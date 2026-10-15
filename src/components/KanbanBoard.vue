<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  'update-status': [id: string, status: TaskStatus]
}>()

const columns: { status: TaskStatus; label: string; accent: string }[] = [
  { status: 'todo', label: '待办', accent: 'bg-slate-400' },
  { status: 'in-progress', label: '进行中', accent: 'bg-indigo-500' },
  { status: 'done', label: '已完成', accent: 'bg-emerald-500' },
]

const draggedTaskId = ref<string | null>(null)
const activeDropStatus = ref<TaskStatus | null>(null)

const tasksByStatus = computed(() => {
  return Object.fromEntries(
    columns.map(({ status }) => [
      status,
      props.tasks
        .filter((task) => task.status === status)
        .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)),
    ]),
  ) as Record<TaskStatus, Task[]>
})

function startDrag(event: DragEvent, taskId: string) {
  draggedTaskId.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function allowDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  activeDropStatus.value = status
}

function clearDragState() {
  draggedTaskId.value = null
  activeDropStatus.value = null
}

function dropTask(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value
  if (taskId) {
    emit('update-status', taskId, status)
  }
  clearDragState()
}
</script>

<template>
  <section class="grid grid-cols-1 items-start gap-4 md:grid-cols-3" aria-label="看板任务">
    <section
      v-for="column in columns"
      :key="column.status"
      class="min-h-64 rounded-xl border p-4 transition-colors sm:p-5"
      :class="activeDropStatus === column.status
        ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-950/60'
        : 'border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900'"
      :aria-label="`${column.label}任务列`"
      @dragover="allowDrop($event, column.status)"
      @dragleave="activeDropStatus === column.status && (activeDropStatus = null)"
      @drop="dropTask($event, column.status)"
    >
      <header class="mb-4 flex items-center justify-between">
        <h2 class="m-0 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span class="h-2.5 w-2.5 rounded-full" :class="column.accent" aria-hidden="true" />
          {{ column.label }}
        </h2>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {{ tasksByStatus[column.status].length }}
        </span>
      </header>

      <div class="grid min-h-44 content-start gap-3">
        <div
          v-for="task in tasksByStatus[column.status]"
          :key="task.id"
          class="cursor-grab transition-opacity active:cursor-grabbing"
          :class="draggedTaskId === task.id ? 'opacity-40' : ''"
          draggable="true"
          @dragstart="startDrag($event, task.id)"
          @dragend="clearDragState"
        >
          <TaskCard
            :task="task"
            @toggle="emit('toggle', task.id)"
            @delete="emit('delete', task.id)"
          />
        </div>
        <p
          v-if="tasksByStatus[column.status].length === 0"
          class="m-0 rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500"
        >
          拖放任务到此处
        </p>
      </div>
    </section>
  </section>
</template>
