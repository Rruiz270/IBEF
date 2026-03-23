/**
 * Generate a prefixed unique ID using crypto.randomUUID().
 *
 * Example: newId('task') → "task-a1b2c3d4-..."
 */
export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
