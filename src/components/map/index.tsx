import {
  useJsApiLoader,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
} from '@react-google-maps/api';
import { useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';
import ClickModal from '@/components/click-modal'; // Import ClickModal
import { FullScreenLoader } from '../full-screen-loader';
import { Button } from '../ui/button';
import VoteForm from '../forms/vote-form';
import { Dialog, DialogContent } from '../ui/dialog';

interface Location {
  lat: number;
  lng: number;
}

const DEFAULT_LOCATION: Location = { lat: 28.6139, lng: 77.209 };
const LIBRARIES: ['places', 'geometry'] = ['places', 'geometry'];

const mapOptions = {
  styles: [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ visibility: 'off' }], // Hides roads
    },
    {
      featureType: 'road',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }], // Hides roads
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }], // Hides points of interest
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }], // Hides transit labels
    },
  ],
};

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [modalOpen, setModalOpen] = useState(false); // 🔥 New state to control modal
  const [status, setStatus] = useState('');

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced function to fetch votes
  const fetchVotes = useCallback(
    debounce(async (lat: number, lng: number, radius: number) => {
      try {
        await axios.get('http://localhost:3001/api/votes/radius', {
          params: { lat, lng, radius },
        });
      } catch (error) {
        toast.error('Failed to fetch votes by radius');
      }
    }, 500),
    []
  );

  // Handle search box selection
  const handlePlaceSelect = () => {
    if (searchBoxRef.current) {
      const newPlaces = searchBoxRef.current.getPlaces();
      if (newPlaces && newPlaces.length > 0) {
        handlePlaceClick(newPlaces[0]);
      }
    }
  };

  const getPlaceFromCoordinates = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && Array.isArray(results) && results.length > 0) {
        let placeName = 'Unknown Location';

        // 🔥 1. Try to get City or Town
        const cityResult = results.find(
          (result) =>
            result.types.includes('locality') ||
            result.types.includes('postal_town')
        );

        if (cityResult) {
          placeName = cityResult.formatted_address;
        } else {
          // 🔥 2. If no city, try to get Region (State/Province)
          const regionResult = results.find((result) =>
            result.types.includes('administrative_area_level_1')
          );

          if (regionResult) {
            placeName = regionResult.formatted_address;
          } else {
            // 🔥 3. If no region, try to get Country
            const countryResult = results.find((result) =>
              result.types.includes('country')
            );

            if (countryResult) {
              placeName = countryResult.formatted_address;
            }
          }
        }
        setSelectedPlace(placeName);

        console.log('Selected Place:', placeName);
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  };
  // 🔥 Handle map click
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setLocation({ lat, lng });
      setClickPosition({
        x: (e.domEvent as MouseEvent).clientX,
        y: (e.domEvent as MouseEvent).clientY,
      });
      getPlaceFromCoordinates(lat, lng); // Fetch place details
      setModalOpen(true); // Open modal
    }
  };
  // Handle map marker click
  const handlePlaceClick = (
    place: google.maps.places.PlaceResult,
    event?: google.maps.MapMouseEvent
  ) => {
    const lat = place.geometry?.location?.lat() || 0;
    const lng = place.geometry?.location?.lng() || 0;
    setLocation({ lat, lng });
    getPlaceFromCoordinates(lat, lng);
    setSearchQuery('');
    fetchVotes(lat, lng, 5);

    if (event?.domEvent) {
      const mouseEvent = event.domEvent as MouseEvent; // Fix TypeScript issue
      setClickPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }

    setModalOpen(true); // 🔥 Open modal on click
  };

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className='w-screen h-screen relative'>
      {/* Search Box */}
      <div className='absolute top-2 right-15 z-40 bg-white shadow-md rounded-xs w-80'>
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlaceSelect}
        >
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              ref={inputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search a place...'
              className='w-full h-11 pl-10 pr-10 transition-all focus-visible:ring-2'
            />
            {searchQuery && (
              <X
                className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer'
                onClick={() => {
                  setSearchQuery('');
                  setPlaces([]);
                }}
              />
            )}
          </div>
        </StandaloneSearchBox>
      </div>

      {/* Google Map */}
      <GoogleMap
        center={location}
        zoom={15}
        options={mapOptions}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onClick={handleMapClick}
      >
        <Marker
          position={location}
          onClick={(event) =>
            handlePlaceClick(
              selectedPlace as google.maps.places.PlaceResult,
              event
            )
          }
        />
      </GoogleMap>

      {/* Click Modal for Selected Place */}
      {selectedPlace && (
        <ClickModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          position={clickPosition}
          title={selectedPlace || 'Selected Place'}
        >
          Would you like to create votee in{' '}
          <span className='text-blue-950 font-semibold'>{selectedPlace}?</span>
          <div className='flex justify-between mt-5'>
            <Button
              className='bg-teal-600'
              onClick={() => {
                setModalOpen(false);
                setStatus('create-votee');
              }}
            >
              Yes
            </Button>
            <Button onClick={() => setModalOpen(false)} variant='destructive'>
              No
            </Button>
          </div>
        </ClickModal>
      )}
      <Dialog open={status === 'create-votee'}>
        <DialogContent>
          <VoteForm
            pending={false}
            onSubmit={({ name, categories, message }) =>
              console.log(name, categories, message)
            }
          />
        </DialogContent>
      </Dialog>
      {isLoading && (
        <FullScreenLoader text='Loading, please wait...' opacity={50} />
      )}
    </div>
  );
};

export default Map;
