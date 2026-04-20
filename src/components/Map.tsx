import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Passo, Itinerary } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';

type LeafletDefaultIconPrototype = L.Icon.Default & { _getIconUrl?: unknown };

delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ROUTE_COLORS = [
  '#f97316', '#3b82f6', '#22c55e', '#a855f7',
  '#ef4444', '#eab308', '#06b6d4', '#ec4899',
];

interface MapProps {
  passi?: Passo[];
  selectedPasso?: Passo | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
  itineraries?: Itinerary[];
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    setTimeout(() => map.invalidateSize(), 100);
  }, [map, center, zoom]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);
  return null;
}

function ItineraryRoute({ itinerary, color }: { itinerary: Itinerary; color: string }) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (itinerary.passi.length < 2) return;

    const waypoints = itinerary.passi
      .map(p => `${p.coordinates.lng},${p.coordinates.lat}`)
      .join(';');

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`
    )
      .then(res => res.json())
      .then(data => {
        if (data.routes?.[0]?.geometry?.coordinates) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );
          setRouteCoords(coords);
        }
      })
      .catch(() => {
        // Fallback: straight lines between passi
        setRouteCoords(
          itinerary.passi.map(p => [p.coordinates.lat, p.coordinates.lng])
        );
      });
  }, [itinerary]);

  const markerIcon = (isFirst: boolean, isLast: boolean) =>
    L.divIcon({
      className: '',
      html: `<div style="
        width: 14px; height: 14px; border-radius: 50%;
        background: ${isFirst || isLast ? color : '#fff'};
        border: 3px solid ${color};
        box-shadow: 0 0 0 2px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

  return (
    <>
      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color, weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
        />
      )}
      {itinerary.passi.map((passo, idx) => (
        <Marker
          key={passo.id}
          position={[passo.coordinates.lat, passo.coordinates.lng]}
          icon={markerIcon(idx === 0, idx === itinerary.passi.length - 1)}
        >
          <Popup>
            <div className="text-dark-900">
              <p className="text-xs font-semibold" style={{ color }}>{itinerary.title}</p>
              <h3 className="font-semibold mb-1">{passo.name}</h3>
              <p className="text-sm text-gray-600">{passo.region}</p>
              <p className="text-sm text-gray-600">{passo.elevation} m</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function Map({ passi = [], selectedPasso, center, zoom = 6, className = '', itineraries }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => { setIsMounted(true); }, []);

  const allPassi = itineraries
    ? itineraries.flatMap(i => i.passi)
    : passi;

  const defaultCenter: [number, number] = center || [41.9028, 12.4964];

  const getMapCenter = (): [number, number] => {
    if (selectedPasso) return [selectedPasso.coordinates.lat, selectedPasso.coordinates.lng];
    if (allPassi.length > 0) {
      const avgLat = allPassi.reduce((sum, p) => sum + p.coordinates.lat, 0) / allPassi.length;
      const avgLng = allPassi.reduce((sum, p) => sum + p.coordinates.lng, 0) / allPassi.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  };

  const getMapZoom = (): number => {
    if (selectedPasso) return 12;
    if (allPassi.length > 0) return 7;
    return zoom;
  };

  if (!isMounted) {
    return (
      <div className={`rounded-lg overflow-hidden border border-dark-700 bg-dark-800 flex items-center justify-center ${className}`} style={{ height: '100%', minHeight: '400px' }}>
        <div className="text-gray-400">{t('map.loading')}</div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-dark-700 ${className}`} style={{ height: '100%', minHeight: '400px' }}>
      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />
        <MapUpdater center={getMapCenter()} zoom={getMapZoom()} />

        {/* Itinerary mode: colored polylines + per-passo markers */}
        {itineraries?.map((itinerary, idx) => (
          <ItineraryRoute
            key={itinerary.id}
            itinerary={itinerary}
            color={ROUTE_COLORS[idx % ROUTE_COLORS.length]}
          />
        ))}

        {/* Passo mode: standard blue/red markers */}
        {!itineraries && passi.map((passo) => (
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
