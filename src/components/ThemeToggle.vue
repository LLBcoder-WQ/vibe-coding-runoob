<script setup lang="ts">
import { ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'vibe-coding-runoob-theme'

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initialTheme = getInitialTheme()
const theme = ref<Theme>(initialTheme)

function applyTheme(nextTheme: Theme, persist = true) {
  theme.value = nextTheme
  document.documentElement.classList.toggle('dark', nextTheme === 'dark')

  if (!persist) return

  try {
    localStorage.setItem(STORAGE_KEY, nextTheme)
  } catch {
    // Theme switching still works for this session if storage is unavailable.
  }
}

applyTheme(initialTheme, false)

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-indigo-900"
    :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    :title="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
      <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
