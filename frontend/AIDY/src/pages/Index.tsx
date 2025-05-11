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
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { retrievePlaces, updatePlaces, getCurrentCrowdData } from '@/lib/api';

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
      // Call the backend API to retrieve places
      const response = await retrievePlaces(query);
      console.log(response)
      // Transform the API response to match our UI's expected format
      // The PlacesList component expects objects with place_name, address, current_density, and current_time
      const placesData = response.results.map((place, index) => ({
        place_name: place.place_name,
        address: place.address || '',
        current_density: place.current_density || 0,
        current_time: place.current_time || new Date().toLocaleString()
      }));
      
      setPlaces(placesData);
      toast({
        title: `${listName} places loaded successfully`,
        description: `Found ${placesData.length} locations`,
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

  const handleAddPlace = async (newPlace: Omit<Place, 'id'>) => { // Make it async
    setIsLoading(true);
    try {
      // Construct the query string for the backend.
      // AddPlaceForm currently sends newPlace.address as '' if not entered.
      const query = newPlace.address && newPlace.address.trim() !== ''
        ? `${newPlace.place_name} ${newPlace.address}`
        : newPlace.place_name;

      // Call the backend API to update/add the place
      await updatePlaces(query); // This sends the place to be added to test.json via backend

      // Show a success toast for adding the specific place
      toast({
        title: "Place Submitted",
        description: `${newPlace.place_name} has been submitted to be added to the list. Refreshing data...`,
      });

      // Refresh the entire list from the backend to get the updated data
      // fetchCurrentCrowdData already sets isLoading to false in its finally block,
      // updates the 'places' state, and shows its own toast.
      await fetchCurrentCrowdData();
      
      setActiveTab("places");

    } catch (error) {
      console.error('Error adding place:', error);
      toast({
        title: "Error Adding Place",
        description: `There was a problem adding ${newPlace.place_name}. Please try again.`,
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading is false on error if fetchCurrentCrowdData isn't called
    }
    // No need for a finally block here to set isLoading to false,
    // as fetchCurrentCrowdData will handle it if successful,
    // and the catch block handles it on error.
  };

  const handleDeletePlace = (id: string) => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place.place_name !== id));
    toast({
      title: "Place removed",
      description: "The location has been removed from your list",
    });
  };

  const handleStartMapping = () => {
    setShowTutorial(false);
    setShowSearch(true);
  };

  const fetchCurrentCrowdData = async () => {
    setIsLoading(true);
    try {
      const response = await getCurrentCrowdData();
      
      // Convert to the format expected by PlacesList
      const placesData = response.places.map(place => ({
        place_name: place.place_name,
        address: place.address,
        current_density: place.current_density || 0,
        current_time: place.current_time
      }));
      
      setPlaces(placesData);
      toast({
        title: "Current crowd data loaded",
        description: `Retrieved data for ${placesData.length} locations`,
      });
    } catch (error) {
      console.error('Error fetching crowd data:', error);
      toast({
        title: "Error loading crowd data",
        description: "There was a problem retrieving the current crowd data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Tourism Density Mapper</h1>
              
              <Button 
                onClick={fetchCurrentCrowdData}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex gap-2 items-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Update Crowd Data
              </Button>
            </div>
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
