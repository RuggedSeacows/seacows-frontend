export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type Nullable<T> = T | null;

export function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;

  return true;
}

/**
 * A type-hint to improve DX when dealing with intersected types ( i.e A & B )
 * This does not change the underlying type. It only helps the typescript
 * compiler ( and language-server ) show a refined version of the type
 * which can be easier to read and debug.
 */
export type Pretty<T> = {
  [K in keyof T]: T[K];
} extends infer U
  ? U
  : never;
