import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { MapPin, UploadCloud, Layers } from 'lucide-react';
import { useMapStore } from '../../store/useMapStore';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

export default function Sidebar() {
  const {
    csvData,
    columns,
    selectedAddressCol,
    selectedWeightCol,
    setCsvData,
    setColumns,
    setSelectedAddressCol,
    setSelectedWeightCol,
    setGeocodedData,
    layers,
    toggleLayer,
    humanMarker
  } = useMapStore();

  const [isGeocoding, setIsGeocoding] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          setCsvData(results.data);
          if (results.meta.fields) {
            setColumns(results.meta.fields);
            setSelectedAddressCol(results.meta.fields[0] || '');
            setSelectedWeightCol(results.meta.fields[1] || '');
          }
        },
      });
    }
  }, [setCsvData, setColumns, setSelectedAddressCol, setSelectedWeightCol]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const handleGeocode = async () => {
    if (!csvData.length || !columns.includes(selectedAddressCol) || !columns.includes(selectedWeightCol)) return;
    
    setIsGeocoding(true);
    try {
      // Prepare data
      const addresses = csvData.map((row) => ({
        address: row[selectedAddressCol],
        weight: parseFloat(row[selectedWeightCol]) || 0,
        ...row
      })).filter(item => item.address); // Basic validation

      // Call Serverless API
      // We chunk requests if there are too many, but for now simple call
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses }),
      });
      
      const data = await response.json();
      if (data.results) {
        setGeocodedData(data.results.filter((r: any) => r.geocoded));
      } else {
        console.error('Geocoding failed', data.error);
      }
    } catch (error) {
      console.error('Geocoding error', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-primary" />
        도시계획 시뮬레이터
      </h2>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">1. 공공데이터 업로드</Label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-slate-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">
              CSV 파일을 드래그하거나<br/>클릭하여 업로드하세요
            </p>
          </div>
          {csvData.length > 0 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              ✓ {csvData.length}개의 데이터 로드됨
            </p>
          )}
        </div>

        {/* Column Mapping Section */}
        {columns.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">2. 주소 컬럼 매핑</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedAddressCol} 
                onChange={(e) => setSelectedAddressCol(e.target.value)}
              >
                {columns.map((col, index) => <option key={index} value={col}>{col || `(빈 컬럼명 ${index + 1})`}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">3. 가중치(밀집도) 컬럼 매핑</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedWeightCol} 
                onChange={(e) => setSelectedWeightCol(e.target.value)}
              >
                {columns.map((col, index) => <option key={index} value={col}>{col || `(빈 컬럼명 ${index + 1})`}</option>)}
              </select>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleGeocode} 
              disabled={isGeocoding}
            >
              {isGeocoding ? '변환 중...' : '지오코딩 및 맵핑 시작'}
            </Button>
          </div>
        )}

        {/* Layer Controls Section */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Layers size={16} /> 레이어 제어
          </Label>
          <div className="flex items-center justify-between">
            <Label htmlFor="markers" className="cursor-pointer">로우 데이터 (CircleMarker)</Label>
            <Switch 
              id="markers" 
              checked={layers.showMarkers} 
              onCheckedChange={() => toggleLayer('showMarkers')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="heatmap" className="cursor-pointer">밀집도 (Heatmap)</Label>
            <Switch 
              id="heatmap" 
              checked={layers.showHeatmap} 
              onCheckedChange={() => toggleLayer('showHeatmap')} 
            />
          </div>
        </div>

        {/* Human Marker Panel */}
        <div className="space-y-2 pt-6 border-t border-slate-200">
          <Label className="text-sm font-semibold text-slate-700">최종 선정 입지 (Human Marker)</Label>
          <div className="bg-slate-100 p-4 rounded-lg text-sm border border-slate-200 shadow-inner">
            {humanMarker ? (
              <div className="space-y-1">
                <p><span className="font-medium">위도:</span> {humanMarker.lat.toFixed(5)}</p>
                <p><span className="font-medium">경도:</span> {humanMarker.lng.toFixed(5)}</p>
              </div>
            ) : (
              <p className="text-slate-500 text-center italic">
                지도에서 최적의 위치를<br/>클릭하여 선정하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
