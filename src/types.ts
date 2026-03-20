/**
 * Forces T to have no keys beyond those in Shape.
 * Any excess key K gets typed as `never`, making assignment impossible.
 */
export type ExactObject<T, Shape> = T &
  Record<Exclude<keyof T, keyof Shape>, never>;

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
  toForm: (data: Response) => Form & Record<string, Form[keyof Form] | undefined>;
  toRequest: (data: Form) => Request & Record<string, Request[keyof Request] | undefined>;
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
