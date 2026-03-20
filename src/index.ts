import type { CreateMapper, StrictMapper } from "./types.js";

export const createMapper = (<
  Response extends object,
  Request extends object,
  Form extends object,
>() =>
(
  fns: Record<string, Function>,
): StrictMapper<Response, Form, Request> => {
  return fns as unknown as StrictMapper<Response, Form, Request>;
}) as unknown as CreateMapper;

export type { CreateMapper, DeepExact, DeepRecord, ExactObject, MapperDef, StrictMapper } from "./types.js";
