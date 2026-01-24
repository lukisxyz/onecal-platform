/**
 * This file contains example implementations showing how to use the custom hooks.
 * These are not actual code to import, but serve as documentation for usage patterns.
 */

// ============================================================================
// Example 1: Basic CRUD with useCrud Hook
// ============================================================================

// import { useCrud } from '@/hooks';
//
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;
// }
//
// const { useGetAll, useGetById, useCreate, useUpdate, useDelete } =
//   useCrud<User>('/api/users');
//
// function UserList() {
//   const { data: users, isLoading, error } = useGetAll<User>();
//
//   if (isLoading) return <Spinner />;
//   if (error) return <ErrorMessage error={error} />;
//
//   return (
//     <div>
//       {users?.map((user) => (
//         <UserCard key={user.id} user={user} />
//       ))}
//     </div>
//   );
// }
//
// function UserDetail({ userId }: { userId: string }) {
//   const { data: user, isLoading } = useGetById<User>(userId);
//
//   if (isLoading) return <Spinner />;
//   return <UserProfile user={user} />;
// }
//
// function CreateUser() {
//   const createMutation = useCreate<User>();
//
//   const handleCreate = async (userData: Omit<User, 'id'>) => {
//     createMutation.mutate(userData, {
//       onSuccess: (newUser) => {
//         console.log('User created:', newUser);
//       },
//     });
//   };
//
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         handleCreate({
//           name: formData.get('name') as string,
//           email: formData.get('email') as string,
//           createdAt: new Date().toISOString(),
//         });
//       }}
//     >
//       <input name="name" placeholder="Name" required />
//       <input name="email" placeholder="Email" type="email" required />
//       <button type="submit" disabled={createMutation.isPending}>
//         {createMutation.isPending ? 'Creating...' : 'Create User'}
//       </button>
//     </form>
//   );
// }
//
// function UpdateUser({ userId }: { userId: string }) {
//   const updateMutation = useUpdate<User>();
//
//   const handleUpdate = (data: Partial<User>) => {
//     updateMutation.mutate({ id: userId, data });
//   };
//
//   return <UserForm onSubmit={handleUpdate} />;
// }
//
// function DeleteUser({ userId }: { userId: string }) {
//   const deleteMutation = useDelete();
//
//   const handleDelete = () => {
//     if (confirm('Are you sure?')) {
//       deleteMutation.mutate(userId);
//     }
//   };
//
//   return (
//     <button onClick={handleDelete} disabled={deleteMutation.isPending}>
//       {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
//     </button>
//   );
// }

// ============================================================================
// Example 2: Optimistic Updates
// ============================================================================

// import { useCrudWithOptimistic } from '@/hooks';
//
// const { useCreate, useUpdate } = useCrudWithOptimistic<User>('/api/users');
//
// function OptimisticUpdateExample({ userId }: { userId: string }) {
//   const updateMutation = useUpdate<User>();
//
//   const handleToggleStatus = () => {
//     updateMutation.mutate({
//       id: userId,
//       data: { status: 'active' },
//     });
//   };
//
//   return (
//     <button onClick={handleToggleStatus}>
//       {updateMutation.isPending ? 'Updating...' : 'Toggle Status'}
//     </button>
//   );
// }

// ============================================================================
// Example 3: Paginated Data
// ============================================================================

// import { usePaginatedQuery } from '@/hooks';
//
// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   author: string;
// }
//
// function PostList() {
//   const [params, setParams] = useState({
//     page: 1,
//     limit: 10,
//     sortBy: 'createdAt',
//     sortOrder: 'desc' as const,
//   });
//
//   const { data, isLoading } = usePaginatedQuery<Post>('/api/posts', params);
//
//   const handlePageChange = (newPage: number) => {
//     setParams((prev) => ({ ...prev, page: newPage }));
//   };
//
//   if (isLoading) return <Spinner />;
//
//   return (
//     <div>
//       <div>
//         {data?.data.map((post) => (
//           <PostCard key={post.id} post={post} />
//         ))}
//       </div>
//       <div>
//         <button
//           onClick={() => handlePageChange(params.page - 1)}
//           disabled={params.page === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {data?.page} of {data?.totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(params.page + 1)}
//           disabled={params.page === data?.totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// ============================================================================
// Example 4: Form with Validation and Mutation
// ============================================================================

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { useBaseMutation } from '@/hooks';
//
// const userSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   age: z.number().min(18, 'Must be at least 18 years old'),
// });
//
// type UserFormData = z.infer<typeof userSchema>;
//
// function UserForm() {
//   const createMutation = useBaseMutation<User, Error, UserFormData>(
//     (data) =>
//       fetch('/api/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       }).then((res) => res.json()),
//     {
//       onSuccess: () => {
//         // Show success toast
//         // Reset form
//         // Navigate to list
//       },
//     },
//   );
//
//   const { register, handleSubmit, formState: { errors }, reset } =
//     useForm<UserFormData>({
//       resolver: zodResolver(userSchema),
//     });
//
//   const onSubmit = (data: UserFormData) => {
//     createMutation.mutate(data, {
//       onSuccess: () => reset(),
//     });
//   };
//
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <input {...register('name')} placeholder="Name" />
//         {errors.name && <span>{errors.name.message}</span>}
//       </div>
//
//       <div>
//         <input
//           {...register('email')}
//           placeholder="Email"
//           type="email"
//         />
//         {errors.email && <span>{errors.email.message}</span>}
//       </div>
//
//       <div>
//         <input
//           {...register('age', { valueAsNumber: true })}
//           placeholder="Age"
//           type="number"
//         />
//         {errors.age && <span>{errors.age.message}</span>}
//       </div>
//
//       <button type="submit" disabled={createMutation.isPending}>
//         {createMutation.isPending ? 'Submitting...' : 'Submit'}
//       </button>
//     </form>
//   );
// }

// ============================================================================
// Example 5: Dependent Queries
// ============================================================================

// import { useBaseQuery } from '@/hooks';
//
// function UserPosts({ userId }: { userId: string }) {
//   const { data: user } = useBaseQuery<User>(
//     ['user', userId],
//     () => fetch(`/api/users/${userId}`).then((res) => res.json()),
//     { enabled: !!userId },
//   );
//
//   const { data: posts } = useBaseQuery<Post[]>(
//     ['posts', user?.id],
//     () => fetch(`/api/users/${userId}/posts`).then((res) => res.json()),
//     { enabled: !!user?.id },
//   );
//
//   return (
//     <div>
//       <h2>{user?.name}'s Posts</h2>
//       {posts?.map((post) => (
//         <PostCard key={post.id} post={post} />
//       ))}
//     </div>
//   );
// }

// ============================================================================
// Example 6: Infinite Scrolling
// ============================================================================

// import { useInfiniteQuery } from '@/hooks';
//
// function InfinitePostList() {
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useInfiniteQuery<Post>(
//       '/api/posts',
//       (lastPage) => {
//         return lastPage.page < lastPage.totalPages
//           ? lastPage.page + 1
//           : null;
//       },
//       {
//         getNextPageParam: (lastPage, allPages) => {
//           return lastPage.page < lastPage.totalPages
//             ? lastPage.page + 1
//             : null;
//         },
//       },
//     );
//
//   const loadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };
//
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 1000
//       ) {
//         loadMore();
//       }
//     };
//
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
//
//   return (
//     <div>
//       {data?.pages.map((page, i) => (
//         <React.Fragment key={i}>
//           {page.data.map((post) => (
//             <PostCard key={post.id} post={post} />
//           ))}
//         </React.Fragment>
//       ))}
//       {isFetchingNextPage && <Spinner />}
//     </div>
//   );
// }
