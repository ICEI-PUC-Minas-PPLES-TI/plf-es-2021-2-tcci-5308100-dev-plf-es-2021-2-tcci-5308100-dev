import Skeleton from 'react-loading-skeleton';

const SkeletonViewChallenge = () => {
  return (
    <div>
      <div className='w-100 flex-center flex-column'>
        <Skeleton circle width='200px' height='200px' />
      </div>
      <Skeleton height='30px' count={2} />
      <br />
      <Skeleton count={4} />
    </div>
  );
};

export default SkeletonViewChallenge;
