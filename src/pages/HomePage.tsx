import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import UserCard from '@/components/shared/UserCard';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecentPosts, useGetUsers } from '@/lib/react-query/queries'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom';

const HomePage = () => {
  
  const {data: posts, isLoading, isError} = useGetRecentPosts();
  const {user} = useUserContext();
  const {data: creators, isLoading: isCreatorsLoading} = useGetUsers(user.id, 5);
  const trendingTopics: any = [
    {name: 'India vs Australia', postCount: 203, category: 'Sports'},
    {name: 'Figma latest update', postCount: 72, category: 'Technology'},
    {name: 'Startups', postCount: 72, category: 'Business'},
    {name: 'Stock Market', postCount: 72, category: 'Economy'},
    {name: 'Sam Altman', postCount: 72, category: 'Technology'},
  ];
  
  if(isError) {
    return (
      <div className='home-container h-40 flex text-center justify-center items-center text-gray-400 font-bold'>
        <div className="home-posts">
          Something went wrong! <br />
          Please refresh the page or try again later.
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1'>
      <div className="home-container">
        <div className="home-posts">
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Home Feed
            {
              isLoading && !posts ? (
                <div className='w-full mt-4 h-40 flex justify-center items-center'>
                  <Loader />
                </div>
              ) : (
                <ul className='flex flex-col flex-1 gap-9 w-full mt-4'>
                  {
                    posts?.documents?.map((post: Models.Document) => (
                      <PostCard key={post.$id} post={post} />
                    ))
                  }
                </ul>
              )
            }
          </h2>
        </div>
      </div>
      <div className="home-creators px-1">
        <div className='bg-dark-3 border border-gray-800 py-3 px-2 rounded-md'>
          <h3 className="text-light-1 font-medium text-lg ml-1 mb-2">
            Top Creators
          </h3>
          {
            isCreatorsLoading && !creators ? (
              <div className='h-10 flex justify-center items-center'>
                <Loader size={20} />
              </div>
            ) : (
              <ul className='grid 2xl:grid-cols-2 gap-3'>
                {
                  creators?.documents.slice(0, 5).map((creator: Models.Document) => (
                    <li key={creator?.$id}>
                      <UserCard user={creator} />
                    </li>
                  ))
                }
              </ul>
            )
          }
          <Link to='/all-users' className='w-full block text-primary-500 text-center text-sm mt-2 cursor-pointer'>
            See all
          </Link>
        </div>

        <div className='bg-dark-3 border border-gray-800 py-3 px-2 rounded-md'>
          <h3 className="text-light-1 font-medium text-lg ml-1 mb-3">
            Trending today
          </h3>
          {
            isCreatorsLoading && !creators ? (
              <div className='h-10 flex justify-center items-center'>
                <Loader size={20} />
              </div>
            ) : (
              <ul className='grid 2xl:grid-cols-2 gap-4'>
                {
                  trendingTopics.map((topic: any, index: number) => (
                    <div className='flex gap-2 justify-between align-start px-2' key={index}>
                      <div className='flex flex-col gap-1 justify-between'>
                        <h4 className='text-sm font-semibold'>{topic.name}</h4>
                        <span className='text-xs text-gray-400'>#{topic.category}</span>
                      </div>
                      <span className='text-xs text-primary-500 bg-primary-500/10 h-fit px-2 py-1 rounded-md'>{topic.postCount} posts</span>
                    </div>
                  ))
                }
              </ul>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default HomePage