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

      window.location.href = data.original_url;
    };

    fetchPhotoUrl();
  }, [id, navigate]);

  return null;
};

export default PhotoPage;