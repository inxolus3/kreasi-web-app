let sequence = 0;
export const buildSetting = (overrides: Record<string, unknown> = {}) => { sequence += 1; return { key: `test_setting_${sequence}`, value: `value-${sequence}`, group: 'general', ...overrides }; };
