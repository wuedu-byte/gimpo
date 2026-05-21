import { create } from 'zustand';

export interface GeocodedData {
  lat: number;
  lng: number;
  weight: number;
  address: string;
  [key: string]: any; // To hold other raw properties
}

interface MapState {
  csvData: any[];
  columns: string[];
  selectedAddressCol: string;
  selectedWeightCol: string;
  geocodedData: GeocodedData[];
  layers: {
    showMarkers: boolean;
    showHeatmap: boolean;
  };
  humanMarker: { lat: number; lng: number } | null;
  
  // Actions
  setCsvData: (data: any[]) => void;
  setColumns: (columns: string[]) => void;
  setSelectedAddressCol: (col: string) => void;
  setSelectedWeightCol: (col: string) => void;
  setGeocodedData: (data: GeocodedData[]) => void;
  toggleLayer: (layer: keyof MapState['layers']) => void;
  setHumanMarker: (marker: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  csvData: [],
  columns: [],
  selectedAddressCol: '',
  selectedWeightCol: '',
  geocodedData: [],
  layers: {
    showMarkers: true,
    showHeatmap: true,
  },
  humanMarker: null,

  setCsvData: (csvData) => set({ csvData }),
  setColumns: (columns) => set({ columns }),
  setSelectedAddressCol: (selectedAddressCol) => set({ selectedAddressCol }),
  setSelectedWeightCol: (selectedWeightCol) => set({ selectedWeightCol }),
  setGeocodedData: (geocodedData) => set({ geocodedData }),
  toggleLayer: (layer) => 
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] }
    })),
  setHumanMarker: (humanMarker) => set({ humanMarker }),
}));
