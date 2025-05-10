
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName) return;
    onAddPlace({
      place_name: placeName,
      address: '',
      current_density: 0, // default value
      current_time: '',   // or new Date().toLocaleString() if you want
    });
    setPlaceName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-medium">Add New Place</h3>
      
      <div className="grid gap-2">
      <Label htmlFor="name">Location Name</Label>
      <Input 
        id="name" 
        value={placeName} 
        onChange={(e) => setPlaceName(e.target.value)} 
        placeholder="Eiffel Tower" 
      />
    </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Add Place
      </Button>
    </form>
  );
};

export default AddPlaceForm;
