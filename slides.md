# @tanstack/query 

---

# Server state doesn't belong in Pinia!

---

## What types of State do we use in most Web Applications?

- ### Application State
  - often spans multiple components
  - might house some business logic
  - interactivity across the component tree
  - prevent prop drilling
  - form validation

---
## What types of State do we use in most Web Applications?

- ### Application State
  - often spans multiple components
  - might house some business logic
  - interactivity across the component tree
  - prevent prop drilling
  - form validation

<br/>

- ### Server State
  - fetched from the server
  - error and loading states of network calls

Often these are 2 are both handled in global state like Vuex / Pinia / Redux

---
## I don't like this

```typescript
import { defineStore } from "pinia";
import axios, { type AxiosError } from "axios";

type MyError = {
  message: string;
};

type ErrorState = MyError | null;

defineStore("todo", {
  state: () => ({
    todos: [] as Todo[],
    todosLoading: false,
    fetchTodosError: null as ErrorState,
    addTodoLoading: false,
    addTodoError: null as ErrorState,
  }),
  actions: {
    async getTodos() {
      this.todosLoading = true;
      try {
        const res = await axios.get<Todo[]>("/api/todos");
        this.fetchTodosError = null;
        this.todos = res.data;
      } catch (e) {
        this.fetchTodosError = ((e as AxiosError).response
                ?.data as ErrorState) ?? { message: "Unknown Error" };
      } finally {
        this.todosLoading = false;
      }
    },
    async addTodo(title: string) {
      this.addTodoLoading = true;
      try {
        const res = await axios.post<Todo>("/api/todos", { title });
        this.addTodoError = null;
        this.getTodos();
      } catch (e) {
        this.todos = prev;
        this.addTodoError = ((e as AxiosError).response
                ?.data as ErrorState) ?? { message: "Unknown Error" };
      } finally {
        this.addTodoLoading = false;
      }
    },
  },
});
```

---

### I don't like this


```typescript
import { defineStore } from "pinia";
import axios, { type AxiosError } from "axios";

type MyError = {
  message: string;
};

type ErrorState = MyError | null;

defineStore("todo", () => {
  const todos = ref<Todo[]>([]);
  const todosLoading = ref(false);
  const fetchTodosError = ref<MyError>();
  const addTodoLoading = ref(false);
  const addTodoError = ref<MyError>();
  const getTodos = async () => {
    todosLoading.value = true;
    try {
      const res = await axios.get<Todo[]>("/api/todos");
      fetchTodosError.value = null;
      todos.value = res.data;
    } catch (e) {
      fetchTodosError.value = ((e as AxiosError).response
              ?.data as ErrorState) ?? { message: "Unknown Error" };
    } finally {
      todosLoading.value = false;
    }
  };
  // Optimistic Update & rollback
  const addTodo = async (title: string) => {
    addTodoLoading.value = true;
    try {
      const res = await axios.post<Todo>("/api/todos", { title });
      addTodoError.value = null;
      getTodos()
    } catch (e) {
      todos.value = prev;
      addTodoError.value = ((e as AxiosError).response?.data as ErrorState) ?? {
        message: "Unknown Error",
      };
    } finally {
      addTodoLoading.value = false;
    }
  };

  return {
    todos,
    todosLoading,
    fetchTodosError,
    addTodoLoading,
    addTodoError,
    getTodos,
    addTodo,
  };
});
```

---

### I don't like this

And this type of state (data, loading, error) is replicated for each query or mutation.

---

## This I prefer

```typescript
const {
  data: todos,
  isLoading,
  isError,
  status,
  error,
} = useQuery({
  queryKey: ["todos"],
  queryFn: () => axios.get<Todo[]>("/api/todos"),
  select: (res) => res.data,
  initialData: [],
});

const queryClient = useQueryClient();
const {
  mutate: addTodo,
  isLoading: addTodoLoading,
  isError: todoIsError,
  error: addTodoError,
  // variente fuer optimistic updates
  isPending,
  variables
} = useMutation(
  (title: string) =>
    axios.post<Todo>("/api/todos", { title }).then((res) => res.data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["todos"]);
    },
  }
);
<template>
<ul>
  <li v-for="todo in todos">
    {{todo.title}}
  </li>
  <li v-if="isPending">
    {{variables}}
  </li>
</ul>
</template>
```

---

## This I prefer

Each query receives a key. Calls to useQuery across the component tree will be batched and only result in 1 Network call.

```typescript
useQuery({
  queryKey: ["todos"],
  queryFn: () => axios.get<Todo[]>("/api/todos"),
  select: (res) => res.data,
  initialData: [],
});
```

---

## This I prefer

And we get a bunch of stuff for free:

```typescript
const {data: todos, isLoading, isError, error, isPending, variables: addedTodo, status} = useQuery({
  queryKey: ["todos"],
  queryFn: () => axios.get<Todo[]>("/api/todos"),
  select: (res) => res.data,
  initialData: [],
});
```

---

## This I prefer

More free stuff!


```typescript
useQuery({
  queryKey: ["todos"],
  queryFn: () => axios.get<Todo[]>("/api/todos"),
  select: (res) => res.data,
  initialData: [],
  refetchInterval: 1000, // polling
  refetchOnWindowFocus: true, // default: true
  refetchOnReconnect: true, // default: true
  refetchOnMount: true, // default: true
  retry: 3, // default: 3
  retryDelay: 1000,
  cacheTime: 1000 * 60 * 5, // default: 5 minutes
});
```

more stuff but no example provided:
- Paginated Queries
- Infinite Queries
- Prefetching

---

## This I prefer

- We also have a way to handle our mutations and get similar benefits.
- When we invalidate the query this results in the query from the previous example to get refetched automatically


```typescript
const queryClient = useQueryClient();
const {
  mutate: addTodo,
  isLoading: addTodoLoading,
  isError: todoIsError,
  error: addTodoError,
  // Optimistic UI updates
  isPending,
  variables
} = useMutation(
  (title: string) =>
    axios.post<Todo>("/api/todos", {title}).then((res) => res.data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["todos"]);
    },
  }
);
```

---

## Testing

You might want to test network calls. Just use something like nock for that.

---

## Live Demo

---

---

## Are you interested on a follow up talk about Nuxt + TRPC?

trpc -> Typescript Remote Procedure Call, Fullstack Typesafety without code generation.
