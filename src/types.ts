/**
 * Forces T to have no keys beyond those in Shape.
 * Any excess key K gets typed as `never`, making assignment impossible.
 */
export type ExactObject<T, Shape> = T &
  Record<Exclude<keyof T, keyof Shape>, never>;

/**
 * Recursively intersects every object level with an index signature
 * `Record<string, T[keyof T] | undefined>`, so excess properties at
 * any nesting depth are constrained to existing value types.
 */
export type DeepRecord<T> = T extends readonly any[]
  ? T
  : T extends object
    ? { [K in keyof T]: DeepRecord<T[K]> } & Record<
        string,
        T[keyof T] | undefined
      >
    : T;

/**
 * The config object passed to `createMapper`.
 * Uses plain callback signatures so TypeScript applies its built-in
 * excess property checking on object literal returns.
 */
export interface MapperDef<
  Response extends object,
  Form extends object,
  Request extends object,
> {
  toForm: (data: Response) => DeepRecord<Form>;
  toRequest: (data: Form) => DeepRecord<Request>;
}

/**
 * The mapper object returned by `createMapper`.
 * Generic method parameters enforce exact input shapes at each call site,
 * preventing excess properties even when spread into the argument.
 */
export interface StrictMapper<
  Response extends object,
  Form extends object,
  Request extends object,
> {
  toForm: <T extends Response>(
    data: ExactObject<T, Response>,
  ) => Form;
  toRequest: <T extends Form>(
    data: ExactObject<T, Form>,
  ) => Request;
}

export type CreateMapper = {
  <Response extends object, Request extends object, Form extends object>():
    (fns: MapperDef<Response, Form, Request>) => StrictMapper<Response, Form, Request>;
  <Response extends object, Request extends object>():
    <Form extends object>(fns: MapperDef<Response, Form, Request>) => StrictMapper<Response, Form, Request>;
};
