"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";
import { type LatLngExpression, DivIcon } from "leaflet";
import { cn } from "@/lib/utils";
import { createRoot } from "react-dom/client";
import { CustomMarker } from "./custom-marker";

type MapLocation = {
  position: LatLngExpression;
  name: string;
  description?: string;
  active?: boolean;
};

type MapProps = {
  center?: LatLngExpression;
  zoom?: number;
  locations?: MapLocation[];
  height?: string;
  width?: string;
  className?: string;
  showZoomControls?: boolean;
};

function ChangeView({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function MarkerWithCustomIcon({ location }: { location: MapLocation }) {
  const [icon, setIcon] = useState<L.DivIcon>();

  useEffect(() => {
    const markerContainer = document.createElement("div");
    const root = createRoot(markerContainer);
    root.render(
      <CustomMarker active={location.active} size="md" pulse={true} />
    );

    const newIcon = new DivIcon({
      className: "custom-marker-icon",
      html: markerContainer,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    setIcon(newIcon);
  }, [location.active]);

  if (!icon) return null;

  return (
    <Marker position={location.position} icon={icon}>
      <Popup className="rounded-md shadow-lg">
        <div className="p-1">
          <h3 className="font-medium text-blue-600">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-gray-600">{location.description}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({
  center = [-23.5505, -46.6333],
  zoom = 18,
  locations = [],
  height = "500px",
  width = "100%",
  className = "",
  showZoomControls = true,
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height, width }}
        className={cn("bg-muted flex items-center justify-center", className)}
      >
        Carregando mapa...
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width }}
      className={cn("z-10", className)}
      zoomControl={showZoomControls}
      dragging={false}
      minZoom={12}
      scrollWheelZoom={false}
      ref={mapRef}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <MarkerWithCustomIcon key={index} location={location} />
      ))}
    </MapContainer>
  );
}
