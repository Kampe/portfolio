<template>
  <div class="fixed bottom-4 left-4 w-80 max-h-[600px] bg-slate-900/95 border border-cyan-500/50 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-sm">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-slate-800/80">
      <h2 class="text-sm font-bold text-cyan-300 uppercase tracking-wider">Parameter Panel</h2>
      <button
        @click="collapsed = !collapsed"
        class="text-cyan-400 hover:text-cyan-300 transition-colors"
        title="Toggle"
      >
        {{ collapsed ? '▼' : '▲' }}
      </button>
    </div>

    <!-- Content -->
    <div v-if="!collapsed" class="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
      <!-- Theme selector -->
      <div v-if="availableThemes.length > 0">
        <label class="block text-cyan-300 font-semibold mb-2">Theme</label>
        <select
          :value="currentTheme"
          @change="(e: any) => $emit('theme-change', e.target.value)"
          class="w-full bg-slate-700 border border-cyan-500/30 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
        >
          <option v-for="theme in availableThemes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>
      </div>

      <!-- Parameter groups -->
      <div
        v-for="group in groupedParams"
        :key="group.category"
        class="border-l-2 border-cyan-500/30 pl-3"
      >
        <h3 class="text-cyan-400 font-semibold mb-2">{{ group.category }}</h3>
        <div class="space-y-2">
          <div v-for="param in group.params" :key="param.key" class="flex flex-col gap-1">
            <label class="text-cyan-300/80">
              {{ param.definition.name }}
              <span v-if="param.definition.description" class="text-slate-400 text-xs block">
                {{ param.definition.description }}
              </span>
            </label>

            <!-- Range slider -->
            <input
              v-if="param.definition.type === 'range'"
              type="range"
              :value="param.value"
              :min="param.definition.min"
              :max="param.definition.max"
              :step="param.definition.step || 0.01"
              @input="updateParameter(param.key, parseFloat(($event.target as HTMLInputElement).value))"
              class="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-cyan-500"
            />

            <!-- Number input -->
            <input
              v-else-if="param.definition.type === 'number'"
              type="number"
              :value="param.value"
              @input="updateParameter(param.key, parseFloat(($event.target as HTMLInputElement).value))"
              class="w-full bg-slate-700 border border-cyan-500/30 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
            />

            <!-- Color picker -->
            <input
              v-else-if="param.definition.type === 'color'"
              type="color"
              :value="param.value"
              @input="updateParameter(param.key, ($event.target as HTMLInputElement).value)"
              class="w-full h-8 bg-slate-700 border border-cyan-500/30 rounded cursor-pointer"
            />

            <!-- Boolean toggle -->
            <label v-else-if="param.definition.type === 'boolean'" class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="param.value"
                @change="updateParameter(param.key, ($event.target as HTMLInputElement).checked)"
                class="accent-cyan-500"
              />
              <span class="text-slate-300">{{ param.value ? 'Enabled' : 'Disabled' }}</span>
            </label>

            <!-- Select dropdown -->
            <select
              v-else-if="param.definition.type === 'select'"
              :value="param.value"
              @change="updateParameter(param.key, ($event.target as HTMLSelectElement).value)"
              class="w-full bg-slate-700 border border-cyan-500/30 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="option in param.definition.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>

            <!-- Display current value -->
            <div class="text-slate-500 text-xs">
              {{ typeof param.value === 'number' ? param.value.toFixed(2) : param.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="!collapsed" class="border-t border-cyan-500/30 px-4 py-2 bg-slate-800/80 flex gap-2">
      <button
        @click="$emit('reset-params')"
        class="flex-1 bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs py-1 rounded transition-colors"
        title="Reset to defaults"
      >
        Reset
      </button>
      <button
        @click="showPresetDialog = true"
        class="flex-1 bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs py-1 rounded transition-colors"
        title="Save current parameters"
      >
        Save Preset
      </button>
    </div>

    <!-- Preset Dialog -->
    <div
      v-if="showPresetDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
      @click="showPresetDialog = false"
    >
      <div
        @click.stop
        class="bg-slate-800 border border-cyan-500 rounded-lg p-4 shadow-2xl max-w-sm"
      >
        <h3 class="text-cyan-300 font-bold mb-3">Save Parameter Preset</h3>
        <input
          v-model="presetName"
          type="text"
          placeholder="Enter preset name..."
          class="w-full bg-slate-700 border border-cyan-500/30 rounded px-2 py-1 text-white mb-3 text-xs"
          @keyup.enter="savePreset"
        />
        <div class="flex gap-2">
          <button
            @click="savePreset"
            class="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-1 rounded text-xs font-semibold transition-colors"
          >
            Save
          </button>
          <button
            @click="showPresetDialog = false"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-cyan-300 py-1 rounded text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ParameterSet, ParameterDefinition } from '../art/vectorCloud/themes/core/parameterTuning'

interface GroupedParameter {
  key: string
  value: any
  definition: ParameterDefinition
}

interface ParameterGroup {
  category: string
  params: GroupedParameter[]
}

const props = defineProps<{
  parameters: ParameterSet
  definitions: Record<string, ParameterDefinition>
  availableThemes: string[]
  currentTheme: string
}>()

const emit = defineEmits<{
  'param-change': [key: string, value: any]
  'theme-change': [theme: string]
  'reset-params': []
  'save-preset': [name: string, params: ParameterSet]
}>()

const collapsed = ref(false)
const showPresetDialog = ref(false)
const presetName = ref('')

const groupedParams = computed(() => {
  const groups: Record<string, GroupedParameter[]> = {}

  Object.entries(props.definitions).forEach(([key, def]) => {
    const category = def.category || 'General'
    if (!groups[category]) groups[category] = []

    groups[category].push({
      key,
      value: props.parameters[key],
      definition: def,
    })
  })

  return Object.entries(groups).map(([category, params]) => ({
    category,
    params,
  }))
})

const updateParameter = (key: string, value: any) => {
  emit('param-change', key, value)
}

const savePreset = () => {
  if (presetName.value.trim()) {
    emit('save-preset', presetName.value, { ...props.parameters })
    presetName.value = ''
    showPresetDialog.value = false
  }
}
</script>
