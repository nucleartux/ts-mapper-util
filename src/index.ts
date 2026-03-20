import type { CreateMapper, MapperDef, StrictMapper } from "./types.js";

export const createMapper: CreateMapper = <
  Response extends object,
  Request extends object,
  Form extends object,
>() =>
(
  fns: MapperDef<Response, Form, Request>,
): StrictMapper<Response, Form, Request> => {
  return fns as unknown as StrictMapper<Response, Form, Request>;
};

export type { CreateMapper, DeepRecord, ExactObject, MapperDef, StrictMapper } from "./types.js";
