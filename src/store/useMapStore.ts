import { create } from 'zustand';

export interface GeocodedData {
  lat: number;
  lng: number;
  weight: number;
  [key: string]: any; // To hold other raw properties
}

interface MapState {
  csvData: any[];
  geocodedData: GeocodedData[];
  humanMarker: { lat: number; lng: number } | null;
  
  // Actions
  setCsvData: (data: any[]) => void;
  setGeocodedData: (data: GeocodedData[]) => void;
  setHumanMarker: (marker: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  csvData: [],
  geocodedData: [],
  humanMarker: null,

  setCsvData: (csvData) => set({ csvData }),
  setGeocodedData: (geocodedData) => set({ geocodedData }),
  setHumanMarker: (humanMarker) => set({ humanMarker }),
}));
