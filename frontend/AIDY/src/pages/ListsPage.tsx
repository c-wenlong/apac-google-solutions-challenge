import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Map, Trash2 } from 'lucide-react';
import testJsonData from '../../../../app/test.json';

interface TourismList {
  id: string;
  name: string;
  placesCount: number;
  lastUpdated: string;
}

const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Declare state variables outside conditionals
  const [lists, setLists] = useState<TourismList[]>([]);
  
  // Use useEffect to set the initial state conditionally
  useEffect(() => {
    if (testJsonData) {
      const newName = "Stockholm";
      const lastUpdated = "2025-05-12";
      
      setLists([
        {
          id: '1',
          name: 'London Landmarks',
          placesCount: 5,
          lastUpdated: '2025-05-08'
        },
        {
          id: '2',
          name: 'Tokyo Destinations',
          placesCount: 7,
          lastUpdated: '2025-05-07'
        },
        // {
        //   id: '3',
        //   name: newName,
        //   placesCount: 7,
        //   lastUpdated: lastUpdated
        // }
      ]);
    } else {
      setLists([
        {
          id: '1',
          name: 'London Landmarks',
          placesCount: 5,
          lastUpdated: '2025-05-08'
        },
        {
          id: '2',
          name: 'Tokyo Destinations',
          placesCount: 7,
          lastUpdated: '2025-05-07'
        }
      ]);
    }
  }, []);
  
  const handleDeleteList = (id: string) => {
    setLists(lists.filter(list => list.id !== id));
  };

  const handleCreateNewList = () => {
    navigate('/');
  };

  const handleViewDetails = (listName: string) => {
    navigate('/', { state: { listName } });
  };
  
  return (
    <div className="container mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Tourism Lists</h1>
        <p className="text-muted-foreground mb-4">
          Manage your saved tourism density maps
        </p>
        <Button onClick={handleCreateNewList} className="bg-blue-600 hover:bg-blue-700">
          Create New List
        </Button>
      </div>
      
      {lists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.map(list => (
            <Card key={list.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <CardDescription>
                  {list.placesCount} {list.placesCount === 1 ? 'place' : 'places'} • Last updated {list.lastUpdated}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <Map size={48} className="text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleViewDetails(list.name)}
                >
                  View Details
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No lists available. Create your first list to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
