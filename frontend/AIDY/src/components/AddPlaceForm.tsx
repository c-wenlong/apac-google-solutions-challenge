import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Place } from './PlacesList';

interface AddPlaceFormProps {
  onAddPlace: (place: Omit<Place, 'id'>) => void;
}

const AddPlaceForm: React.FC<AddPlaceFormProps> = ({ onAddPlace }) => {
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName) return;
    setLoading(true);
    onAddPlace({
      place_name: placeName,
      address: '',
      current_density: 0, // default value
      current_time: '',   // or new Date().toLocaleString() if you want
    });
    setPlaceName('');
    setTimeout(() => setLoading(false), 1500); // Simulate loading
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border border-border">
        <h3 className="text-lg font-medium">Add New Place</h3>
        <div className="grid gap-2">
          <Label htmlFor="name">Location Name</Label>
          <Input 
            id="name" 
            value={placeName} 
            onChange={(e) => setPlaceName(e.target.value)} 
            placeholder="Eiffel Tower" 
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading || !placeName.trim()}
        >
          Add Place
        </Button>
      </form>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-blue-700">Adding place...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlaceForm;
