# Pinia is for Application State, not client-server synchronization!

Hi Ich bin Frederik und ich hasse Globalen State.

---

## Scherz, Globaler State ist praktisch. Nur nicht um Client & Server zu synchronisieren.

---

## Beispiel 1

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
  }),
  actions: {
    async getTodos() {
      this.todosLoading = true;
      try {
        const res = await axios.get<Todo[]>("/api/todos");
        this.fetchTodosError = false;
        this.todos = res.data;
      } catch (e) {
        this.fetchTodosError = ((e as AxiosError).response
          ?.data as ErrorState) ?? { message: "Unknown Error" };
      } finally {
        this.todosLoading = false;
      }
    },
  },
});
```

### Und das für einen simplen get request. Dabei haben wir noch keine:

- Mutationen
- Optimistic updates & error rollbacks
- Automatisches refetch wenn der Browser neu fokussiert wird / bei Tab wechsel etc.
- Polling

---

## Beispiel 2

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
    // Optimistic Update & rollback
    async addTodo(title: string) {
      this.addTodoLoading = true;
      const prev = this.todos;
      this.todos = [...this.todos, { title }];
      try {
        const res = await axios.post<Todo>("/api/todos", { title });
        this.addTodoError = null;
        prev.push(res.data);
        this.todos = prev;
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

## Beispiel 3

### Options Api ist leider nicht besser.

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
    const prev = todos.value;
    todos.value = [...todos.value, { title }];
    try {
      const res = await axios.post<Todo>("/api/todos", { title });
      addTodoError.value = null;
      prev.push(res.data);
      todos.value = prev;
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

## Mein Problem

Ich finde das nervig.

Zum Glück gibt es dafür Abstraktionen, die einem das Leben vereinfachen.

---

## @tanstack/query

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
  // 1. variente fuer optimistic updates
  isPending,
  variables
} = useMutation(
  (title: string) =>
    axios.post<Todo>("/api/todos", { title }).then((res) => res.data),
  {
    // Automatisches Refetch
    onSuccess() {
      queryClient.invalidateQueries(["todos"]);
    },
    // 2. variante (Optional) Optimistic Update
    onMutate(title) {
      const todos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], [...todos, { title }]);
      return todos;
    },
    // 2. variante (Optional) Error Rollback
    onError(_err, _vars, ctx) {
      queryClient.setQueryData(["todos"], ctx);
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

## Grobes gedankliches Modell

Queries:

- Haben keys
- Daten sind "stale" sobald sie da sind
  - Stale Time kan angepasst werden. (effektiv Client side caching)
- stale Queries werden automatisch neu geladen wenn:
  - window / tab focus
  - remount des components
- werden neu geladen wenn sie invalidiert werden
- koennen auch imperativ geupdated werden

Mutations:

- haben mutate/mutateAsync Function
- optimistic updates / optimistic ui update (einfacher als optimistic state update)
- invalidieren queries per Callback

---

# Live Demo
