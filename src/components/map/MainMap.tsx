
import { MapContainer, TileLayer, CircleMarker, Marker, useMapEvents } from 'react-leaflet';

import { useMapStore } from '../../store/useMapStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom red pin for Human Marker
const RedPinIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// react-leaflet-heatmap-layer-v3 is usually exported as default or we might need the factory
// Since v3, we need to ensure it's compatible. The package is `react-leaflet-heatmap-layer-v3`
// Let's use it dynamically or via standard import.
// @ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

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
  const { geocodedData, layers, humanMarker } = useMapStore();

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

        {layers.showHeatmap && geocodedData.length > 0 && (
          <HeatmapLayer
            fitBoundsOnLoad={false}
            fitBoundsOnUpdate={false}
            points={geocodedData}
            longitudeExtractor={(m: any) => m.lng}
            latitudeExtractor={(m: any) => m.lat}
            intensityExtractor={(m: any) => m.weight}
            radius={20}
            max={100} // adjust max intensity as needed
            minOpacity={0.2}
          />
        )}

        {layers.showMarkers && geocodedData.map((marker, idx) => (
          <CircleMarker
            key={idx}
            // @ts-ignore
            center={[marker.lat, marker.lng]}
            radius={5}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.6 }}
          />
        ))}

        {humanMarker && (
          // @ts-ignore
          <Marker position={[humanMarker.lat, humanMarker.lng]} icon={RedPinIcon} />
        )}

        <InteractiveMap />
      </MapContainer>
    </div>
  );
}
