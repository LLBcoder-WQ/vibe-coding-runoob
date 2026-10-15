<script setup lang="ts">
import type { Task, TaskPriority } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
}>()

const priorityLabels: Record<TaskPriority, string> = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'border-l-green-500 bg-green-50 text-green-700 dark:border-l-green-400 dark:bg-green-950 dark:text-green-300',
  medium: 'border-l-yellow-500 bg-yellow-50 text-yellow-700 dark:border-l-yellow-400 dark:bg-yellow-950 dark:text-yellow-300',
  high: 'border-l-red-500 bg-red-50 text-red-700 dark:border-l-red-400 dark:bg-red-950 dark:text-red-300',
}

const priorityBorderStyles: Record<TaskPriority, string> = {
  low: 'border-l-green-500 dark:border-l-green-400',
  medium: 'border-l-yellow-500 dark:border-l-yellow-400',
  high: 'border-l-red-500 dark:border-l-red-400',
}
</script>

<template>
  <article
    class="group relative rounded-xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    :class="priorityBorderStyles[task.priority]"
  >
    <button
      type="button"
      class="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-xl leading-none text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-300 dark:focus:ring-red-900 sm:right-2 sm:top-2"
      :aria-label="`删除任务：${task.title}`"
      @click="emit('delete')"
    >
      <span aria-hidden="true">×</span>
    </button>

    <div class="flex items-start gap-3 pr-8">
      <label :for="`task-${task.id}-completed`" class="-ml-3 -mt-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
        <input
          :id="`task-${task.id}-completed`"
          type="checkbox"
          :checked="task.status === 'done'"
          class="h-5 w-5 cursor-pointer rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
          :aria-label="`标记任务完成：${task.title}`"
          @change="emit('toggle')"
        />
      </label>

      <div class="min-w-0 flex-1">
        <label
          :for="`task-${task.id}-completed`"
          class="block cursor-pointer text-base font-semibold text-slate-800 dark:text-slate-100"
          :class="task.status === 'done' ? 'text-slate-400 line-through dark:text-slate-500' : ''"
        >
          {{ task.title }}
        </label>
        <p class="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{{ task.description }}</p>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="priorityStyles[task.priority]">
            {{ priorityLabels[task.priority] }}
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400">截止日期：{{ task.dueDate || '未设置' }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
