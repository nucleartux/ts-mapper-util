# ts-mapper-util

Type-safe bidirectional mappers between API responses, form state, and API requests.

`createMapper` enforces exact object shapes at both definition and call sites, catching excess properties, missing fields, and type mismatches at compile time.

## Installation

```bash
npm install ts-mapper-util
```

## Usage

```typescript
import { createMapper } from "ts-mapper-util";

type UserResponse = { id: number; first_name: string; last_name: string };
type UserRequest = { fullName: string };
type UserForm = { name: string };

const userMapper = createMapper<UserResponse, UserRequest, UserForm>()({
  toForm: (data) => ({
    name: `${data.first_name} ${data.last_name}`,
  }),
  toRequest: (data) => ({
    fullName: data.name,
  }),
});

const form = userMapper.toForm({ id: 1, first_name: "John", last_name: "Doe" });
// { name: "John Doe" }

const request = userMapper.toRequest({ name: "John Doe" });
// { fullName: "John Doe" }
```

### Inferred Form type

When the `Form` shape can be inferred from `toForm`, you can omit the third generic:

```typescript
const userMapper = createMapper<UserResponse, UserRequest>()({
  toForm: (data) => ({
    name: `${data.first_name} ${data.last_name}`,
  }),
  toRequest: (data) => ({
    fullName: data.name,
  }),
});
```

### Spread operator protection

TypeScript normally skips excess property checks when objects are spread into arguments or return values. `ts-mapper-util` catches these cases too — a key differentiator from plain type annotations:

```typescript
const extra = { fullName: "John", debug: true };

// ✅ Caught — excess property 'debug' via spread at call site
userMapper.toRequest({ ...extra });

// ✅ Caught — excess property in spread return from mapper definition
createMapper<UserResponse, UserRequest, UserForm>()({
  toForm: (data) => ({
    name: data.first_name,
    ...{ leftover: true }, // error: excess property
  }),
  toRequest: (data) => ({
    fullName: data.name,
  }),
});
```

## API

### `createMapper<Response, Request, Form>()`

Curried factory that returns a mapper builder. Pass `toForm` and `toRequest` callbacks to define the mapping.

Returns a `StrictMapper<Response, Form, Request>` with:

- **`toForm(data: Response): Form`** — maps an API response to form state
- **`toRequest(data: Form): Request`** — maps form state to an API request

## Development

```bash
npm install
npx tsc --noEmit
```

Type tests live in `src/types.test.ts` and use `@ts-expect-error` assertions — if `tsc` compiles without errors, all tests pass.
