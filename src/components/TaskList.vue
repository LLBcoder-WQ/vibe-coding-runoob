<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

type TaskFilter = 'all' | TaskStatus

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const selectedFilter = ref<TaskFilter>('all')

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
]

const visibleTasks = computed(() => {
  return [...props.tasks]
    .filter((task) => selectedFilter.value === 'all' || task.status === selectedFilter.value)
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
})
</script>

<template>
  <section aria-label="任务列表">
    <nav class="mb-5 flex flex-wrap gap-2" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="min-h-11 min-w-11 rounded-lg px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-200"
        :class="selectedFilter === filter.value
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-300'"
        :aria-pressed="selectedFilter === filter.value"
        @click="selectedFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </nav>

    <div v-if="visibleTasks.length" class="grid gap-4">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task.id)"
        @delete="emit('delete', task.id)"
      />
    </div>

    <div
      v-else-if="props.tasks.length === 0"
      class="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800"
    >
      <p class="m-0 text-sm text-slate-500 dark:text-slate-400">还没有任务，点击下方按钮创建第一个吧</p>
    </div>

    <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800">
      <p class="m-0 text-sm text-slate-500 dark:text-slate-400">当前状态下没有任务</p>
    </div>
  </section>
</template>
