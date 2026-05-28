import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { MapPin, UploadCloud } from 'lucide-react';
import { useMapStore } from '../../store/useMapStore';
import { Label } from '../ui/label';

export default function Sidebar() {
  const {
    csvData,
    setCsvData,
    setGeocodedData,
    humanMarker,
  } = useMapStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          setCsvData(results.data);
          
          // 바로 파싱하여 맵핑 데이터 생성 (위도, 경도, 학급별 학생수 기준)
          const mappedData = results.data.map((row: any) => {
            return {
              lat: parseFloat(row['위도']),
              lng: parseFloat(row['경도']),
              weight: parseFloat(row['학급별 학생수']) || 1,
              ...row
            };
          }).filter((item: any) => !isNaN(item.lat) && !isNaN(item.lng));
          
          setGeocodedData(mappedData);
        },
      });
    }
  }, [setCsvData, setGeocodedData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-primary" />
        도시계획 시뮬레이터
      </h2>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">공공데이터 업로드 (히트맵 자동 생성)</Label>
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
              ✓ {csvData.length}개의 데이터가 로드되어 히트맵에 반영되었습니다.
            </p>
          )}
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
