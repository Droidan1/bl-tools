import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const PhotoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('photo_mappings')
          .select('original_url')
          .eq('short_id', id)
          .single();

        if (error || !data) {
          console.error('Error fetching photo URL:', error);
          setError('Photo not found');
          return;
        }

        setImageUrl(data.original_url);
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred while loading the photo');
      }
    };

    fetchPhotoUrl();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading photo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            ← Back to Inventory
          </button>
        </div>
        <div className="p-4">
          <img 
            src={imageUrl} 
            alt="Inventory Item" 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoPage;