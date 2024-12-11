import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const PhotoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('photo_mappings')
        .select('original_url')
        .eq('short_id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching photo URL:', error);
        navigate('/');
        return;
      }

      // Open the image URL in the same window
      if (data.original_url) {
        window.location.replace(data.original_url);
      }
    };

    fetchPhotoUrl();
  }, [id, navigate]);

  // Return null while redirecting
  return null;
};

export default PhotoPage;