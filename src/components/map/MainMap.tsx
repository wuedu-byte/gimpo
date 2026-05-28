import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useMapStore } from '../../store/useMapStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// @ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

// Custom red pin for Human Marker
const RedPinIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-red-500 drop-shadow-md">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  `,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function InteractiveMap() {
  const { setHumanMarker } = useMapStore();
  
  useMapEvents({
    // @ts-ignore
    click(e: any) {
      setHumanMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  
  return null;
}

export default function MainMap() {
  const { geocodedData, humanMarker } = useMapStore();

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        // @ts-ignore
        center={[37.6152, 126.7156]} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
      >
        <TileLayer
          // @ts-ignore
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {humanMarker && (
          // @ts-ignore
          <Marker position={[humanMarker.lat, humanMarker.lng]} icon={RedPinIcon} />
        )}
        <InteractiveMap />

        {geocodedData.length > 0 && (
          <HeatmapLayer
            fitBoundsOnLoad={false}
            fitBoundsOnUpdate={false}
            points={geocodedData}
            longitudeExtractor={(m: any) => m.lng}
            latitudeExtractor={(m: any) => m.lat}
            intensityExtractor={(m: any) => m.weight}
            radius={25}
            max={40} // 최대 가중치 기준
            minOpacity={0.4}
          />
        )}
      </MapContainer>
    </div>
  );
}
