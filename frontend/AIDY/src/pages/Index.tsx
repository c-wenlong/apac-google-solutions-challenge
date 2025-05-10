
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import SearchBar from '@/components/SearchBar';
import PlacesList, { Place } from '@/components/PlacesList';
import AddPlaceForm from '@/components/AddPlaceForm';
import TutorialSteps from '@/components/TutorialSteps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  const location = useLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('places');
  const [showSearch, setShowSearch] = useState(false);
  const [listName, setListName] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  // Check if we're coming from a list
  useEffect(() => {
    if (location.state && location.state.listName) {
      setListName(location.state.listName);
      setShowTutorial(false);
      setShowSearch(false);
      
      // If the list name is "asd", load the example places
      if (location.state.listName === "asd") {
        const asdListPlaces = [
          { 
            id: '1', 
            name: 'Eiffel Tower', 
            location: 'Paris, France', 
            lat: 48.8584, 
            long: 2.2945, 
            densityScore: 85,
            address: '7th arrondissement',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          },
          { 
            id: '2', 
            name: 'Louvre Museum', 
            location: 'Paris, France', 
            lat: 48.8606, 
            long: 2.3376, 
            densityScore: 72,
            address: 'Rue de Rivoli',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          },
          { 
            id: '3', 
            name: 'Notre-Dame Cathedral', 
            location: 'Paris, France', 
            lat: 48.8530, 
            long: 2.3499, 
            densityScore: 45,
            address: '6 Parvis Notre-Dame',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          }
        ];
        setPlaces(asdListPlaces);
      }
    }
  }, [location.state]);

  const handleStartSearch = () => {
    setShowSearch(true);
    setShowTutorial(false);
  };

  const handleSearch = async (query: string) => {
    if (!listName.trim()) {
      toast({
        title: "List name required",
        description: "Please enter a name for this list of locations",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be your API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data that would come from your backend
      const mockApiResponse = {
        places: [
          { 
            id: '1', 
            name: 'Eiffel Tower', 
            location: 'Paris, France', 
            lat: 48.8584, 
            long: 2.2945, 
            densityScore: 85,
            address: '7th arrondissement',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          },
          { 
            id: '2', 
            name: 'Louvre Museum', 
            location: 'Paris, France', 
            lat: 48.8606, 
            long: 2.3376, 
            densityScore: 72,
            address: 'Rue de Rivoli',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          },
          { 
            id: '3', 
            name: 'Notre-Dame Cathedral', 
            location: 'Paris, France', 
            lat: 48.8530, 
            long: 2.3499, 
            densityScore: 45,
            address: '6 Parvis Notre-Dame',
            city: 'Paris',
            province: 'Île-de-France',
            country: 'France'
          }
        ]
      };
      
      setPlaces(mockApiResponse.places);
      toast({
        title: `${listName} places loaded successfully`,
        description: `Found ${mockApiResponse.places.length} locations`,
      });
      
    } catch (error) {
      console.error('Error fetching places:', error);
      toast({
        title: "Error loading places",
        description: "There was a problem loading the places data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlace = (newPlace: Omit<Place, 'id'>) => {
    const placeWithId = {
      ...newPlace,
      id: Date.now().toString(),
    };
    
    setPlaces(prevPlaces => [...prevPlaces, placeWithId]);
    toast({
      title: "Place added",
      description: `${newPlace.place_name} has been added to your list.`,
    });
    setActiveTab("places");
  };

  const handleDeletePlace = (id: string) => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== id));
    toast({
      title: "Place removed",
      description: "The location has been removed from your list",
    });
  };

  const handleStartMapping = () => {
    setShowTutorial(false);
    setShowSearch(true);
  };

  return (
    <div className="container mx-auto min-h-screen">
      {places.length === 0 ? (
        <div>
          {showTutorial ? (
            <>
              <div className="max-w-3xl mx-auto pt-8 mb-6">
                <Card className="bg-card border border-border mb-8">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <Label htmlFor="listName" className="block mb-2">List Name</Label>
                      <Input
                        id="listName"
                        placeholder="Enter a name for this list (e.g. Stockholm Tour)"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="w-full mb-4"
                      />
                    </div>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                  </CardContent>
                </Card>
                <TutorialSteps onStartMapping={handleStartMapping} />
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto pt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Create New Density Map</h2>
              
              <div className="mb-6">
                <Label htmlFor="listName" className="block mb-2">List Name</Label>
                <Input
                  id="listName"
                  placeholder="Enter a name for this list (e.g. Stockholm Tour)"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full mb-4"
                />
              </div>
              
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShowTutorial(true)} 
                  className="text-blue-500 hover:text-blue-400 underline"
                >
                  Back to tutorial
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tourism Density Mapper</h1>
            <p className="text-muted-foreground">
              Monitor and manage crowd density at popular tourist attractions.
            </p>
            <div className="mt-2">
              <span className="text-lg font-medium">List: </span>
              <span className="text-lg text-blue-500">{listName}</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="places">Places List ({places.length})</TabsTrigger>
              <TabsTrigger value="add">Add New Place</TabsTrigger>
            </TabsList>
            <TabsContent value="places" className="mt-4">
              <PlacesList places={places} onDeletePlace={handleDeletePlace} />
            </TabsContent>
            <TabsContent value="add" className="mt-4">
              <div className="max-w-md mx-auto">
                <AddPlaceForm onAddPlace={handleAddPlace} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Index;
