import { MapContainer, TileLayer } from 'react-leaflet';
import { useMapStore } from '../../store/useMapStore';
import 'leaflet/dist/leaflet.css';

// @ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

export default function MainMap() {
  const { geocodedData } = useMapStore();

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
