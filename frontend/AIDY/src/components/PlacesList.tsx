
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface Place {
  address?: string;
  place_name: string;
  current_density: number;
  current_time: string;
}

interface PlacesListProps {
  places: Place[];
  onDeletePlace: (id: string) => void;
}

const getDensityColor = (density: number) => {
  if (density < 30) return 'bg-green-500';
  if (density < 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const PlacesList: React.FC<PlacesListProps> = ({ places, onDeletePlace }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <Card key={place.place_name} className="overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${getDensityColor(place.current_density)}`}></span>
            {place.place_name}
          </CardTitle>
          <CardDescription>{place.address}</CardDescription>
          <div className="text-xs text-zinc-400">{place.current_time}</div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Density:</span>
            <span>{place.current_density}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" size="icon" onClick={() => onDeletePlace(place.place_name)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardFooter>
      </Card>
      ))}
    </div>
  );
};

export default PlacesList;
