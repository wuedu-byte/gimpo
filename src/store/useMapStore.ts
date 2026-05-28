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
  
  // Actions
  setCsvData: (data: any[]) => void;
  setGeocodedData: (data: GeocodedData[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  csvData: [],
  geocodedData: [],

  setCsvData: (csvData) => set({ csvData }),
  setGeocodedData: (geocodedData) => set({ geocodedData }),
}));
