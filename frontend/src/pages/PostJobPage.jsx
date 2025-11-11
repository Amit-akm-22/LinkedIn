import JobPostForm from '../components/JobPostForm';
import { useNavigate } from 'react-router-dom';

const PostJobPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (job) => {
    navigate('/my-posted-jobs');
  };

  return <JobPostForm onSuccess={handleSuccess} />;
};

export default PostJobPage;