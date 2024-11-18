/** Recursive type that computes the intersection of keys at each nested level */
export type IntersectingKeys<T1, T2> = {
  [K in Extract<keyof T1, keyof T2>]: T1[K] extends object
    ? T2[K] extends object
      ? IntersectingKeys<T1[K], T2[K]>
      : T1[K]
    : T1[K];
};

/**
 * checks if the key `(Keys)` starts with the provided prefix `(Prefix)`.
 * If it does, it strips the prefix and returns only the part after the dot `(Rest)`.
 */
export type RemovePrefix<Prefix extends string, Keys extends string> = Keys extends `${Prefix}.${infer Rest}`
  ? Rest
  : never;
