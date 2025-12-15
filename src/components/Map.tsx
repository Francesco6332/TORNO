import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Passo } from '@/types';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  passi: Passo[];
  selectedPasso?: Passo | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export default function Map({ passi, selectedPasso, center, zoom = 6, className = '' }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  const defaultCenter: [number, number] = center || [41.9028, 12.4964]; // Rome, Italy

  const getMapCenter = (): [number, number] => {
    if (selectedPasso) {
      return [selectedPasso.coordinates.lat, selectedPasso.coordinates.lng];
    }
    if (passi.length > 0) {
      const avgLat = passi.reduce((sum, p) => sum + p.coordinates.lat, 0) / passi.length;
      const avgLng = passi.reduce((sum, p) => sum + p.coordinates.lng, 0) / passi.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  };

  const getMapZoom = (): number => {
    if (selectedPasso) return 12;
    if (passi.length > 0) return 7;
    return zoom;
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-dark-700 ${className}`}>
      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={getMapCenter()} zoom={getMapZoom()} />
        {passi.map((passo) => (
          <Marker
            key={passo.id}
            position={[passo.coordinates.lat, passo.coordinates.lng]}
            icon={L.icon({
              iconUrl: selectedPasso?.id === passo.id
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <div className="text-dark-900">
                <h3 className="font-semibold mb-1">{passo.name}</h3>
                <p className="text-sm text-gray-600">{passo.region}</p>
                <p className="text-sm text-gray-600">{passo.elevation} m</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

