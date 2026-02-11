import { settings, updateSettings, SETTING_ITEMS } from '../stores/settings'

export function SettingsPanel() {
  return (
    <div class="qq-friend-box qq-settings-panel">
      <button class="qq-btn">设置</button>
      <div class="qq-settings-form">
        {SETTING_ITEMS.map((item) => (
          <div key={item.key}>
            <div class="qq-settings-row">
              <label>{item.label}</label>
              <input
                type="checkbox"
                checked={settings.value[item.key] as boolean}
                onChange={(e) =>
                  updateSettings({ [item.key]: e.currentTarget.checked })
                }
              />
            </div>
            {item.description && (
              <div class="qq-settings-note">{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
