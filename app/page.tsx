import HotelsTable from '@/components/HotelsTable';
import { hotels } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Hotels</h1>
        <p className="text-sm text-gray-600">
          {hotels.length} upscale-to-luxury hotels across Canada, the USA and Mexico. Click a hotel to open its PDF report. Hotels marked Verified have been re-checked against current sources.
        </p>
      </div>
      <HotelsTable hotels={hotels} />
    </div>
  );
}
