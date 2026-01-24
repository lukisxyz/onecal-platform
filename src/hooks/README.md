# TanStack Query Hooks

This directory contains custom hooks built on top of TanStack Query (@tanstack/react-query) for managing server state in your React application.

## Setup

The hooks are already configured in `src/providers.tsx` with QueryClientProvider wrapping your application.

## Available Hooks

### 1. Base Query Hooks (`useBaseQuery.ts`)

Hooks for creating reusable queries with different configurations.

```typescript
import { useBaseQuery } from '@/hooks';

// Basic usage
const { data, isLoading, error } = useBaseQuery<User[]>(
  ['users'],
  () => fetch('/api/users').then(res => res.json()),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
);

// With enabled condition
const { data } = useBaseQueryEnabled<User>(
  ['user', id],
  () => fetch(`/api/users/${id}`).then(res => res.json()),
  !!id // Only enabled when id exists
);
```

### 2. Base Mutation Hooks (`useBaseMutation.ts`)

Hooks for creating reusable mutations.

```typescript
import { useBaseMutation } from '@/hooks';

// Basic mutation
const mutation = useBaseMutation<User, Error, CreateUserPayload>(
  (data) => fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(res => res.json()),
  {
    onSuccess: (user) => {
      // Handle success
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  }
);

// Use the mutation
mutation.mutate({ name: 'John Doe', email: 'john@example.com' });
```

### 3. API Query Hooks (`useApiQuery.ts`)

Flexible hooks for making HTTP requests.

```typescript
import { useApiQuery, useApiGetQuery, useApiPostQuery } from '@/hooks';

// Flexible API query
const { data, isLoading } = useApiQuery<User[]>('/api/users', {
  method: 'GET',
  staleTime: 5 * 60 * 1000,
});

// GET with query parameters
const { data: user } = useApiGetQuery<User>('/api/users', { id: '123' });

// POST request
const { data: newUser } = useApiPostQuery<User>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

### 4. CRUD Hooks (`useCrud.ts`)

Complete CRUD operations for any resource.

```typescript
import { useCrud } from '@/hooks';

// Initialize CRUD for a resource
const {
  useGetAll,
  useGetById,
  useCreate,
  useUpdate,
  useDelete,
} = useCrud<User>('/api/users');

// Get all users
const { data: users, isLoading } = useGetAll();

// Get single user
const { data: user, isLoading } = useGetById('123');

// Create user
const createMutation = useCreate();
createMutation.mutate({
  name: 'John Doe',
  email: 'john@example.com',
});

// Update user
const updateMutation = useUpdate();
updateMutation.mutate({
  id: '123',
  data: { name: 'Jane Doe' },
});

// Delete user
const deleteMutation = useDelete();
deleteMutation.mutate('123');
```

### 5. Optimistic Updates (`useCrudWithOptimistic.ts`)

CRUD hooks with optimistic updates for better UX.

```typescript
import { useCrudWithOptimistic } from '@/hooks';

const {
  useCreate,
  useUpdate,
} = useCrudWithOptimistic<User>('/api/users');

// Optimistic create - UI updates immediately
const createMutation = useCreate();
createMutation.mutate({
  name: 'John Doe',
  email: 'john@example.com',
});

// Optimistic update - UI updates immediately
const updateMutation = useUpdate();
updateMutation.mutate({
  id: '123',
  data: { name: 'Jane Doe' },
});
```

## Best Practices

### 1. Use Query Keys Properly

Always use descriptive query keys:

```typescript
// Good
['users', 'profile', userId]
['posts', 'comments', postId]
['products', 'category', categoryId, { page: 1, limit: 10 }]

// Bad
['data']
['stuff']
```

### 2. Handle Loading and Error States

```typescript
const { data, isLoading, error, isError } = useGetAll();

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage error={error} />;
return <DataList data={data} />;
```

### 3. Invalidate Queries After Mutations

```typescript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (data) => updateUser(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

### 4. Use Enabled for Dependent Queries

```typescript
// Only fetch user posts after user is loaded
const { data: user } = useGetById(userId);
const { data: posts } = useGetUserPosts(user?.id, {
  enabled: !!user?.id,
});
```

### 5. Set Appropriate Stale Times

```typescript
// Static data - longer stale time
const { data } = useGetStaticData(queryKey, queryFn, {
  staleTime: 30 * 60 * 1000, // 30 minutes
});

// Real-time data - shorter stale time
const { data } = useGetLiveData(queryKey, queryFn, {
  staleTime: 5 * 1000, // 5 seconds
});
```

## Example Usage in a Component

```typescript
import { useCrud } from '@/hooks';

export function UserList() {
  const { useGetAll, useDelete } = useCrud<User>('/api/users');
  const { data: users, isLoading } = useGetAll();
  const deleteMutation = useDelete();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

## Example with Form Submission

```typescript
import { useState } from 'react';
import { useApiPostQuery } from '@/hooks';

export function CreateUserForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { mutate, isPending, isSuccess } = useApiPostQuery<User>('/api/users');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {isSuccess && <p>User created successfully!</p>}
    </form>
  );
}
```

## Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query (TanStack Query) GitHub](https://github.com/TanStack/query)
- [TanStack Query React Examples](https://tanstack.com/query/latest/examples/react)
