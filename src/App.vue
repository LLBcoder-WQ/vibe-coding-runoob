<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import {
  addTask as addTaskToStore,
  deleteTask as deleteTaskFromStore,
  taskStore,
  updateTask,
} from './stores/taskStore'
import type { Task, TaskStatus } from './types/task'

const isTaskModalOpen = ref(false)
const mobileMenuOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const completedCount = computed(() => taskStore.tasks.filter((task) => task.status === 'done').length)
const inProgressCount = computed(() => taskStore.tasks.filter((task) => task.status === 'in-progress').length)

function addTask(task: Task) {
  addTaskToStore(task)
  isTaskModalOpen.value = false
}

function openTaskModal() {
  isTaskModalOpen.value = true
  mobileMenuOpen.value = false
}

function toggleTask(id: string) {
  const task = taskStore.tasks.find((item) => item.id === id)
  if (task) {
    updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' })
  }
}

function updateTaskStatus(id: string, status: TaskStatus) {
  updateTask(id, { status })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="mx-auto max-w-6xl px-5 sm:px-8" aria-label="主导航">
        <div class="flex items-center justify-between py-3">
          <a href="#" class="flex items-center gap-3 text-slate-900 no-underline dark:text-white">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path d="m7 12 3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <span class="text-base font-semibold tracking-tight sm:text-lg">Vibe Coding Runoob</span>
          </a>
          <div class="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div class="hidden h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 sm:flex" aria-label="用户头像">
              V
            </div>
          </div>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-navigation-menu"
            :aria-label="mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" class="h-6 w-6" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" class="h-6 w-6" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div
          v-if="mobileMenuOpen"
          id="mobile-navigation-menu"
          class="grid gap-2 border-t border-slate-200 py-3 dark:border-slate-800 sm:hidden"
        >
          <a
            href="#task-section"
            class="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileMenuOpen = false"
          >
            我的任务
          </a>
          <button
            type="button"
            class="flex min-h-11 items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="openTaskModal"
          >
            新建任务
          </button>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">工作空间 / 我的任务</p>
          <h1 class="m-0 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">任务管理</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">把想法变成下一步行动。</p>
        </div>
        <button
          type="button"
          class="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-900 sm:self-auto"
          @click="openTaskModal"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
            <path d="M10 4a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 10 4Z" />
          </svg>
          新建任务
        </button>
      </section>

      <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="任务概览">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">全部任务</p>
          <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ taskStore.tasks.length }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">进行中</p>
          <p class="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-300">{{ inProgressCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">已完成</p>
          <p class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-300">{{ completedCount }}</p>
        </div>
      </section>

      <section id="task-section" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="m-0 text-base font-semibold text-slate-900 dark:text-white">所有任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">当前任务列表与进度概览</p>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ taskStore.tasks.length }} 项任务</span>
            <div class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" aria-label="任务视图">
              <button
                type="button"
                class="min-h-11 min-w-11 rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-200"
                :class="activeView === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'"
                :aria-pressed="activeView === 'list'"
                @click="activeView = 'list'"
              >
                列表
              </button>
              <button
                type="button"
                class="min-h-11 min-w-11 rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-200"
                :class="activeView === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'"
                :aria-pressed="activeView === 'kanban'"
                @click="activeView = 'kanban'"
              >
                看板
              </button>
            </div>
          </div>
        </div>
        <TaskList
          v-if="activeView === 'list'"
          :tasks="taskStore.tasks"
          @toggle="toggleTask"
          @delete="deleteTaskFromStore"
        />
        <KanbanBoard
          v-else
          :tasks="taskStore.tasks"
          @toggle="toggleTask"
          @delete="deleteTaskFromStore"
          @update-status="updateTaskStatus"
        />
      </section>

      <p class="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">任务会自动保存在此浏览器中。</p>
    </main>

    <TaskModal v-model="isTaskModalOpen" @create="addTask" />
  </div>
</template>
