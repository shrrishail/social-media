import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, followUser, getCurrentUser, getFollowers, getFollowing, getPostById, getPosts, getRecentPosts, getSavedPosts, getUserById, getUserPosts, getUsers, likePost, savePost, searchPosts, sendNotification, signInAccount, signOutAccount, unFollowUser, unSavePost, updatePost, updatedUser, viewPost } from '../appwrite/api'
import { IFollowerParams, INewPost, INewUser, INotificationParam, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: (pageParam) => getPosts(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage: any) => {
            console.log(lastPage);
            if(lastPage && lastPage.documents.length === 0) {
                return null;
            }

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        }
    })
}

export const useGetPostById = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts(),
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS], 
        });
      },
    });
};

export const useGetUserPosts = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId
    })
}

export const useGetSavedPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
    queryFn: () => getSavedPosts(userId),
    enabled: !!userId
  })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
      },
    });
};
  
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            { postId, imageId }: { postId?: string; imageId: string }
        ) => deletePost(postId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
};
  
export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        postId,
        likesArray,
      }: {
        postId: string;
        likesArray: string[];
      }) => likePost(postId, likesArray),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
};

export const useSendLikeNotification = () => {
  return useMutation({
    mutationFn: (notification: INotificationParam) => sendNotification(notification),
  });
}
  
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
  
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => unSavePost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
  
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (userId: string, limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, limit, userId],
    queryFn: () => getUsers(userId, limit),
  });
};

export const useGetUserById = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
  
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updatedUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      followerParams: IFollowerParams
    ) => followUser(followerParams),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING]
      });
    }
  })
}

export const useUnFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (
      followerParams: IFollowerParams
    ) => unFollowUser(followerParams),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING]
      });
    }
  })
}

export const useGetFollowers = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS, userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  })
}

export const useGetFollowing = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  })
}

export const usePostViewed = () => {
  return useMutation({
    mutationFn: (
      {postId, currentViews}: {postId: string, currentViews: number}
    ) => viewPost(postId, currentViews)
  })
}