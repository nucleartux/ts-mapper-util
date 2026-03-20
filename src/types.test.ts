import { createMapper } from "./index.js";
import type { ExactObject, StrictMapper } from "./types.js";


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
  toForm: (d) => ({
    a: d.a,
    // @ts-expect-error -- excess property 'extra' in toForm return
    extra: true,
  }),
  toRequest: (d) => ({
    a: Number(d.a),
    // @ts-expect-error -- excess property 'extra' in toRequest return
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
  toForm: (d) => ({
    // @ts-expect-error -- wrong return type: a should be string, not number
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
  toRequest: (d) => ({
    // @ts-expect-error -- wrong return type: a should be number, not string
    a: d.a,
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
  toRequest: (d) => ({
    // @ts-expect-error -- wrong return type: a should be number, not string
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
