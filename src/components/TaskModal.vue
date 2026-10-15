<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [open: boolean]
  create: [task: Task]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (open: boolean) => emit('update:modelValue', open),
})
const showTitleError = ref(false)

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  showTitleError.value = false
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

watch(isOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    showTitleError.value = true
    return
  }

  const task: Task = {
    id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}`,
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: '',
    createdAt: new Date().toISOString().slice(0, 10),
  }

  emit('create', task)
  closeModal()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 dark:bg-black/70 sm:items-center sm:p-4"
      @click.self="closeModal"
    >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          class="task-modal-sheet max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl rounded-b-none bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-7"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="task-modal-title" class="m-0 text-xl font-semibold text-slate-900 dark:text-white">新建任务</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息，稍后也可以继续编辑。</p>
            </div>
            <button
              type="button"
              class="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-indigo-900"
              aria-label="关闭弹窗"
              @click="closeModal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <form class="space-y-5" novalidate @submit.prevent="submitTask">
            <div>
              <label for="new-task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">标题 <span class="text-red-500">*</span></label>
              <input
                id="new-task-title"
                v-model="form.title"
                type="text"
                maxlength="120"
                autocomplete="off"
                required
                :aria-invalid="showTitleError && !form.title.trim()"
                aria-describedby="new-task-title-error"
                class="min-h-11 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                :class="showTitleError && !form.title.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''"
                placeholder="例如：整理本周工作计划"
                @input="showTitleError = false"
              />
              <p v-if="showTitleError && !form.title.trim()" id="new-task-title-error" class="mt-1.5 text-sm text-red-600" role="alert">
                标题不能为空
              </p>
            </div>

            <div>
              <label for="new-task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">描述 <span class="text-slate-400 dark:text-slate-500">（选填）</span></label>
              <textarea
                id="new-task-description"
                v-model="form.description"
                rows="3"
                maxlength="500"
                class="min-h-11 w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                placeholder="补充任务的背景或备注"
              />
            </div>

            <div>
              <label for="new-task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">优先级</label>
              <select
                id="new-task-priority"
                v-model="form.priority"
                class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="button"
                class="min-h-11 min-w-11 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-800"
                @click="closeModal"
              >
                取消
              </button>
              <button
                type="submit"
                class="min-h-11 min-w-11 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                创建任务
              </button>
            </div>
          </form>
        </section>
    </div>
  </Teleport>
</template>
