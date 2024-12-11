import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PhotoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, you would fetch the mapping from a database
    // For now, we'll redirect to the original photo URL if available
    const originalUrl = localStorage.getItem(`photo_${id}`);
    if (originalUrl) {
      window.location.href = originalUrl;
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  return null;
};

export default PhotoPage;