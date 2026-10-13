/** API copy sometimes uses em/en dashes as separators; render a plain hyphen instead. */
export const noDash = (value) => (typeof value === 'string' ? value.replace(/\s*[\u2013\u2014]\s*/g, ' - ') : value);
