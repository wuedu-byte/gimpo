
import Sidebar from '../sidebar/Sidebar';
import MainMap from '../map/MainMap';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="w-80 flex-shrink-0 border-r bg-card z-10 shadow-lg flex flex-col h-full">
        <Sidebar />
      </div>
      <div className="flex-1 relative">
        <MainMap />
      </div>
    </div>
  );
}
