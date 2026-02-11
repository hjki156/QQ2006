import { signal } from '@preact/signals'

const SETTINGS_STORAGE_KEY = 'qq2006-settings'

export interface SettingsState {
  streamEnabled: boolean
  deepThinking: boolean
}

export interface SettingItem {
  key: keyof SettingsState
  label: string
  description?: string
  type: 'boolean'
  defaultValue: boolean
}

export const SETTING_ITEMS: SettingItem[] = [
  {
    key: 'streamEnabled',
    label: '流式回应',
    type: 'boolean',
    defaultValue: true,
  },
  {
    key: 'deepThinking',
    label: '深度思考',
    description: '深度思考会降低响应速度,但可能提升回答质量。',
    type: 'boolean',
    defaultValue: false,
  },
]

const DEFAULT_SETTINGS: SettingsState = SETTING_ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.defaultValue }),
  {} as SettingsState,
)

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<SettingsState>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function persistSettings(settings: SettingsState) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore persistence errors
  }
}

const initialSettings = loadSettings()

export const settings = signal<SettingsState>(initialSettings)

export function updateSettings(next: Partial<SettingsState>) {
  settings.value = { ...settings.value, ...next }
  persistSettings(settings.value)
}

// Convenience getters for backward compatibility
export const streamEnabled = { get value() { return settings.value.streamEnabled } }
export const deepThinking = { get value() { return settings.value.deepThinking } }
