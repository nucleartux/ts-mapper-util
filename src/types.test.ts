import { createMapper } from "./index.js";
import type { DeepExact, ExactObject, StrictMapper } from "./types.js";


// ---------------------------------------------------------------------------
// Setup: shared type aliases
// ---------------------------------------------------------------------------
type Resp = { __t: "lol"; a: string };
type Req = { a: number };
type Form = { a: string };

// ============================= VALID USAGE =================================

const mapper = createMapper<Resp, Req, Form>()({
  toForm: (d) => ({
    a: d.a,
  }),
  toRequest: (d) => ({
    a: Number(d.a),
  }),
});


// --- Valid calls with exact shapes ---
mapper.toForm({ __t: "lol", a: "hello" });
mapper.toRequest({ a: "world" });


// ================ EXCESS PROPERTIES AT CALL SITE (spread) ==================

// @ts-expect-error -- excess property 'foo' via spread in toForm call
mapper.toForm({ ...{ foo: "bar" }, a: "123", __t: "lol" });

// @ts-expect-error -- excess property 'baz' via spread in toRequest call
mapper.toRequest({ ...{ baz: "foo" }, a: "world" });

// ================ EXCESS PROPERTIES AT CALL SITE (direct) =================

// @ts-expect-error -- excess property 'extra' in toForm call
mapper.toForm({ __t: "lol", a: "123", extra: true });

// @ts-expect-error -- excess property 'extra' in toRequest call
mapper.toRequest({ a: "123", extra: true });

// ================ EXCESS PROPERTIES AT DEFINITION ==================

createMapper<Resp, Req, Form>()({
  // @ts-expect-error -- excess property 'extra' in toForm return
  toForm: (d) => ({
    a: d.a,
    extra: true,
  }),
  // @ts-expect-error -- excess property 'extra' in toRequest return
  toRequest: (d) => ({
    a: Number(d.a),
    extra: true,
  }),
});


createMapper<Resp, Req, Form>()({
  // @ts-expect-error -- excess property 'extra' in toForm return
  toForm: (d) => ({
    a: d.a,
    ...{extra: true}
  }),
  // @ts-expect-error -- excess property 'extra' in toRequest return
  toRequest: (d) => ({
    a: Number(d.a),
    ...{extra: true}
  }),
});

// ========================= WRONG VALUE TYPES ===============================

createMapper<Resp, Req, Form>()({
  // @ts-expect-error -- wrong return type: a should be string, not number
  toForm: (d) => ({
    a: +d.a,
  }),
  toRequest: (d) => ({
    a: Number(d.a),
  }),
});

createMapper<Resp, Req, Form>()({
  toForm: (d) => ({
    a: d.a,
  }),
  // @ts-expect-error -- wrong return type: a should be number, not string
  toRequest: (d) => ({
    a: d.a,
  }),
});

// ============== EXCESS PROPERTIES AT DEFINITION (nested, spread) ===========

type NestedResp = { targets: { cat1: { x: number }; cat2: { x: number } } };
type NestedReq = { targets: { cat1: { y: number }; cat2: { y: number } } };
type NestedForm = { targets: { cat1: { x: number }; cat2: { x: number } } };

createMapper<NestedResp, NestedReq, NestedForm>()({
  toForm: (d) => ({
    targets: d.targets,
  }),
  toRequest: (d) => ({
    targets: { cat1: { y: 1 }, cat2: { y: 2 } },
  }),
});

createMapper<NestedResp, NestedReq, NestedForm>()({
  // @ts-expect-error -- excess nested property 'foo' via spread in toForm return
  toForm: (d) => ({
    targets: { ...d.targets, foo: "bar" },
  }),
  toRequest: (d) => ({
    targets: { cat1: { y: 1 }, cat2: { y: 2 } },
  }),
});

createMapper<NestedResp, NestedReq, NestedForm>()({
  toForm: (d) => ({
    targets: d.targets,
  }),
  // @ts-expect-error -- excess nested property 'foo' via spread in toRequest return
  toRequest: (d) => ({
    targets: { ...{ cat1: { y: 1 }, cat2: { y: 2 } }, foo: "bar" },
  }),
});

// ======================== MISSING PROPERTIES ===============================

createMapper<Resp, Req, Form>()({
  // @ts-expect-error -- missing property 'a' in toForm return
  toForm: (_d) => ({}),
  toRequest: (d) => ({
    a: Number(d.a),
  }),
});

createMapper<Resp, Req, Form>()({
  toForm: (d) => ({
    a: d.a,
  }),
  // @ts-expect-error -- missing property 'a' in toRequest return
  toRequest: (_d) => ({}),
});

// ============ WRONG ARGUMENT TYPES AT CALL SITE ============================

// @ts-expect-error -- missing required property '__t'
mapper.toForm({ a: "123" });

// @ts-expect-error -- wrong type for 'a' (number instead of string)
mapper.toForm({ __t: "lol", a: 123 });

// @ts-expect-error -- entirely wrong argument
mapper.toRequest(42);

// ===================== TWO-ARG GENERIC (Form inferred) =====================

const mapper2 = createMapper<Resp, Req>()({
  toForm: (d) => ({
    a: d.a,
  }),
  toRequest: (d) => ({
    a: Number(d.a),
  }),
});

// --- Valid calls with exact shapes ---
mapper2.toForm({ __t: "lol", a: "hello" });
mapper2.toRequest({ a: "world" });

// ================ EXCESS PROPERTIES AT CALL SITE (spread) ==================

// @ts-expect-error -- excess property 'foo' via spread in toForm call
mapper2.toForm({ ...{ foo: "bar" }, a: "123", __t: "lol" });

// @ts-expect-error -- excess property 'baz' via spread in toRequest call
mapper2.toRequest({ ...{ baz: "foo" }, a: "world" });

// ================ EXCESS PROPERTIES AT CALL SITE (direct) =================

// @ts-expect-error -- excess property 'extra' in toForm call
mapper2.toForm({ __t: "lol", a: "123", extra: true });

// @ts-expect-error -- excess property 'extra' in toRequest call
mapper2.toRequest({ a: "123", extra: true });

// ========================= WRONG VALUE TYPES ===============================

createMapper<Resp, Req>()({
  toForm: (d) => ({
    a: d.a,
  }),
  // @ts-expect-error -- wrong return type: a should be number, not string
  toRequest: (d) => ({
    a: d.a,
  }),
});

// ======================== MISSING PROPERTIES ===============================

createMapper<Resp, Req>()({
  toForm: (d) => ({
    a: d.a,
  }),
  // @ts-expect-error -- missing property 'a' in toRequest return
  toRequest: (_d) => ({}),
});

// ============ WRONG ARGUMENT TYPES AT CALL SITE ============================

// @ts-expect-error -- missing required property '__t'
mapper2.toForm({ a: "123" });

// @ts-expect-error -- wrong type for 'a' (number instead of string)
mapper2.toForm({ __t: "lol", a: 123 });

// @ts-expect-error -- entirely wrong argument
mapper2.toRequest(42);

// ======== EXCESS PROPERTIES WITH COMPATIBLE VALUE TYPE (rest spread) ========
// Reproduces the real-world bug: rest spread leaks a field whose value type
// happens to be assignable to an existing value type in the target.

type CompatResp = { a: string; extra: number };
type CompatReq = { a: number };
type CompatForm = { a: string; extra: number };

createMapper<CompatResp, CompatReq, CompatForm>()({
  toForm: (d) => ({
    a: d.a,
    extra: d.extra,
  }),
  // @ts-expect-error -- excess property 'extra' from rest spread (number matches existing value types)
  toRequest: ({ a, ...rest }) => ({
    ...rest,
    a: Number(a),
  }),
});

// Same scenario with destructuring that leaves the excess field in rest
type MerchantResp = {
  value: number;
  connection: { key: string } | null;
  merchant: number;
};
type MerchantReq = {
  value: number;
  connection: { key: string } | null;
};
type MerchantForm = {
  value: number;
  connection: { key: string };
  merchant: number;
  useConnection: boolean;
};

createMapper<MerchantResp, MerchantReq, MerchantForm>()({
  toForm: (d) => ({
    value: d.value,
    connection: d.connection ?? { key: "" },
    merchant: d.merchant,
    useConnection: !!d.connection,
  }),
  // @ts-expect-error -- 'merchant' and 'useConnection' leak through rest spread
  toRequest: ({ useConnection, ...d }) => ({
    ...d,
    connection: useConnection ? d.connection : null,
  }),
});

// Verify the fix doesn't break valid rest spread (no excess properties)
type CleanResp = { a: string; b: string };
type CleanReq = { a: number; b: number };
type CleanForm = { a: string; b: string };

createMapper<CleanResp, CleanReq, CleanForm>()({
  toForm: (d) => ({
    a: d.a,
    b: d.b,
  }),
  toRequest: (d) => ({
    a: Number(d.a),
    b: Number(d.b),
  }),
});

// Valid rest spread: all rest fields belong to Request
type RestValidResp = { a: string; b: string; extra: string };
type RestValidReq = { a: number; b: number };
type RestValidForm = { a: string; b: string; extra: string };

createMapper<RestValidResp, RestValidReq, RestValidForm>()({
  toForm: (d) => ({
    a: d.a,
    b: d.b,
    extra: d.extra,
  }),
  toRequest: ({ extra, ...d }) => ({
    a: Number(d.a),
    b: Number(d.b),
  }),
});
