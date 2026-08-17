import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const defaultCenter = { lat: 40.4093, lng: 49.8671 };

function AddressMapPicker({ value, onChange }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [marker, setMarker] = useState(
    value && value.lat != null && value.lng != null
      ? { lat: value.lat, lng: value.lng }
      : null,
  );

  useEffect(() => {
    if (value && value.lat != null && value.lng != null) {
      setMarker({ lat: value.lat, lng: value.lng });
    } else {
      setMarker(null);
    }
  }, [value]);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const position = { lat, lng };
    setMarker(position);
    onChange?.(position);
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "300px" }}
      center={marker || defaultCenter}
      zoom={marker ? 16 : 12}
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