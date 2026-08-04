import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const defaultCenter = {
  lat: 40.4093,
  lng: 49.8671,
};
//! map deyisecek
function AddressMapPicker({ value, onChange }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);

  const [marker, setMarker] = useState(
    value?.lat != null && value?.lng != null
      ? {
          lat: value.lat,
          lng: value.lng,
        }
      : null,
  );

  // Edit zamanı backend-dən gələn koordinata marker qoyur
  useEffect(() => {
    if (value?.lat != null && value?.lng != null) {
      const position = {
        lat: value.lat,
        lng: value.lng,
      };

      setMarker(position);
      mapRef.current?.panTo(position);
    }
  }, [value?.lat, value?.lng]);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const position = {
      lat,
      lng,
    };

    setMarker(position);

    onChange?.(position);
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "300px",
      }}
      center={marker || defaultCenter}
      zoom={marker ? 16 : 12}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onClick={handleMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}

export default AddressMapPicker;