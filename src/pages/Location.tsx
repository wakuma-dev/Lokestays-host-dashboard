import { memo, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLng } from "leaflet";
import {
  Home,
  MapPin,
  Minus,
  Plus,
  Search,
  LoaderCircle,
} from "lucide-react";
import { z } from "zod";
import { useOnboardingStore } from "../features/onboarding/store/onboardingStore";
import type { PropertyLocation } from "../features/onboarding/types/location.types";

interface LocationCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

const photonFeatureSchema = z.object({
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
  }),

  properties: z
    .object({
      name: z.string().optional(),
      street: z.string().optional(),
      housenumber: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      county: z.string().optional(),
      state: z.string().optional(),
      locality: z.string().optional(),
      suburb: z.string().optional(),
      country: z.string().optional(),
    })
    .passthrough(),
});

const photonResponseSchema = z.object({
  features: z.array(photonFeatureSchema),
});

type PhotonFeature = z.infer<typeof photonFeatureSchema>;

// ==========================================
// CONSTANTS
// ==========================================

const INITIAL_POSITION: LocationCoordinates = {
  latitude: 9.03,
  longitude: 38.74,
};

const DEFAULT_ZOOM = 16;
const MIN_ZOOM = 5;
const MAX_ZOOM = 19;

const PHOTON_API = "https://photon.komoot.io";

// ==========================================
// HELPERS
// ==========================================

function formatAddress(feature: PhotonFeature): string {
  const properties = feature.properties;

  const street = [
    properties.housenumber,
    properties.street,
  ]
    .filter(Boolean)
    .join(" ");

  return [
    properties.name,
    street,
    properties.district,
    properties.city,
    properties.state,
    properties.country,
  ]
    .filter(
      (value, index, array) =>
        Boolean(value) && array.indexOf(value) === index,
    )
    .join(", ");
}

function createPropertyLocation(
  feature: PhotonFeature,
  position: LocationCoordinates,
): PropertyLocation | null {
  const properties = feature.properties;

  const city =
    properties.city ??
    properties.county ??
    properties.state ??
    "";

  const address = formatAddress(feature);

  if (!city.trim() || !address.trim()) {
    return null;
  }

  return {
    latitude: position.latitude,
    longitude: position.longitude,
    address,
    city,
    neighborhood:
      properties.district ??
      properties.locality ??
      properties.suburb ??
      "",
  };
}

// ==========================================
// MAP CONTROLS
// ==========================================

function MapControls() {
  const map = useMap();

  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  return (
    <div className="absolute bottom-5 left-5 z-[1000] flex flex-col overflow-hidden rounded-full bg-white shadow-md">
      <button
        type="button"
        aria-label="Zoom in"
        disabled={zoom >= MAX_ZOOM}
        onClick={() => map.zoomIn()}
        className="flex size-12 items-center justify-center border-b border-[#EEEEEE] text-[#222222] hover:bg-gray-100 disabled:opacity-40"
      >
        <Plus size={23} />
      </button>

      <button
        type="button"
        aria-label="Zoom out"
        disabled={zoom <= MIN_ZOOM}
        onClick={() => map.zoomOut()}
        className="flex size-12 items-center justify-center text-[#222222] hover:bg-gray-100 disabled:opacity-40"
      >
        <Minus size={23} />
      </button>
    </div>
  );
}

// ==========================================
// MAP POSITION CONTROLLER
// ==========================================

interface MapPositionProps {
  readonly position: LocationCoordinates;
  readonly onPositionChange: (
    position: LocationCoordinates,
  ) => void;
}

function MapPosition({
  position,
  onPositionChange,
}: MapPositionProps) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();

    const hasMoved =
      Math.abs(currentCenter.lat - position.latitude) > 0.000001 ||
      Math.abs(currentCenter.lng - position.longitude) > 0.000001;

    if (hasMoved) {
      map.flyTo(
        [position.latitude, position.longitude],
        map.getZoom(),
        { duration: 0.8 },
      );
    }
  }, [map, position.latitude, position.longitude]);

  useMapEvents({
    moveend(event) {
      const center: LatLng = event.target.getCenter();

      onPositionChange({
        latitude: center.lat,
        longitude: center.lng,
      });
    },
  });

  return null;
}

// ==========================================
// LOCATION PAGE
// ==========================================

function LocationComponent() {
  // ==========================================
  // ZUSTAND
  // ==========================================

  const savedLocation = useOnboardingStore(
    (state) => state.location,
  );

  const setLocation = useOnboardingStore(
    (state) => state.setLocation,
  );

  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [position, setPosition] =
    useState<LocationCoordinates>(() => ({
      latitude:
        savedLocation?.latitude ??
        INITIAL_POSITION.latitude,

      longitude:
        savedLocation?.longitude ??
        INITIAL_POSITION.longitude,
    }));

  const [address, setAddress] = useState(
    savedLocation?.address ?? "Addis Ababa, Ethiopia",
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [suggestions, setSuggestions] = useState<
    PhotonFeature[]
  >([]);

  const [isSearching, setIsSearching] = useState(false);

  const [isResolvingAddress, setIsResolvingAddress] =
    useState(false);

  const [searchError, setSearchError] = useState<string | null>(
    null,
  );

  // ==========================================
  // MAP POSITION
  // ==========================================

  const handlePositionChange = useCallback(
    (newPosition: LocationCoordinates) => {
      const hasMoved =
        Math.abs(position.latitude - newPosition.latitude) >
          0.000001 ||
        Math.abs(position.longitude - newPosition.longitude) >
          0.000001;

      if (!hasMoved) {
        return;
      }

      setPosition(newPosition);

      // Prevent saving the previous location while
      // reverse geocoding resolves the new coordinates.
      setLocation(null);
    },
    [
      position.latitude,
      position.longitude,
      setLocation,
    ],
  );

  // ==========================================
  // ADDRESS SEARCH
  // ==========================================

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 3) {
      setSuggestions([]);
      setSearchError(null);
      setIsSearching(false);

      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const params = new URLSearchParams({
          q: `${query}, Ethiopia`,
          limit: "5",
        });

        const response = await fetch(
          `${PHOTON_API}/api/?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to search locations.");
        }

        const result: unknown = await response.json();

        const parsed = photonResponseSchema.safeParse(result);

        if (!parsed.success) {
          throw new Error(
            "Invalid location search response.",
          );
        }

        setSuggestions(parsed.data.features);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setSearchError(
          "Unable to search locations. Try again.",
        );

        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  // ==========================================
  // REVERSE GEOCODING
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      setIsResolvingAddress(true);

      try {
        const params = new URLSearchParams({
          lat: String(position.latitude),
          lon: String(position.longitude),
        });

        const response = await fetch(
          `${PHOTON_API}/reverse?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to resolve address.");
        }

        const result: unknown = await response.json();

        const parsed = photonResponseSchema.safeParse(result);

        if (!parsed.success) {
          throw new Error(
            "Invalid reverse geocoding response.",
          );
        }

        const feature = parsed.data.features[0];

        if (!feature) {
          setLocation(null);
          return;
        }

        const resolvedAddress = formatAddress(feature);

        const propertyLocation = createPropertyLocation(
          feature,
          position,
        );

        setAddress(resolvedAddress);

        if (!propertyLocation) {
          setLocation(null);
          setSearchError(
            "Unable to identify the city for this location. Try another nearby position.",
          );

          return;
        }

        setSearchError(null);

        // Save the resolved location into Zustand.
        setLocation(propertyLocation);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setLocation(null);

        setSearchError(
          "Unable to resolve this location. Try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingAddress(false);
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    position.latitude,
    position.longitude,
    setLocation,
  ]);

  // ==========================================
  // SELECT SEARCH RESULT
  // ==========================================

  function handleLocationSelect(feature: PhotonFeature) {
    const [longitude, latitude] =
      feature.geometry.coordinates;

    setLocation(null);

    setPosition({
      latitude,
      longitude,
    });

    setAddress(formatAddress(feature));

    setSearchQuery("");
    setSuggestions([]);
    setSearchError(null);
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main
      className="fixed inset-x-0 top-16 bottom-0 flex w-full items-center justify-center overflow-hidden overscroll-none
        bg-[#FDFDFD] p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white md:pb-4"
    >
      <Helmet>
        <title>Location | Lokestays</title>

        <meta
          name="description"
          content="Choose the location of your accommodation."
        />
      </Helmet>

      <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-6 overflow-hidden">
        <header className="flex shrink-0 flex-col space-y-1">
          <h1 className="text-[26px] leading-[30px] font-semibold tracking-tight md:text-[32px] md:leading-[36px]">
            Is the pin in the right spot?
          </h1>

          <p className="text-[16px] leading-[24px] text-[#6c6c6c] dark:text-[#A1A1AA] md:text-[18px]">
            Your address is only shared with guests after they've
            made a reservation.
          </p>
        </header>

        <div className="relative min-h-0 max-h-[60vh] flex-1 overflow-hidden rounded-2xl">
          <MapContainer
            center={[
              position.latitude,
              position.longitude,
            ]}
            zoom={DEFAULT_ZOOM}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            zoomControl={false}
            scrollWheelZoom
            className="z-0 h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapPosition
              position={position}
              onPositionChange={handlePositionChange}
            />

            <MapControls />
          </MapContainer>

          {/* FIXED CENTER PIN */}

          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
            <div className="flex size-[60px] items-center justify-center rounded-full bg-[#222222] text-white shadow-lg">
              <Home
                size={24}
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* ADDRESS SEARCH */}

          <div className="absolute top-4 right-4 left-4 z-[1000] md:right-5 md:left-5">
            <div className="flex h-[68px] items-center gap-4 rounded-full bg-white px-6 shadow-sm">
              <MapPin
                size={23}
                className="shrink-0 text-[#222222]"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder={address || "Search for your address"}
                aria-label="Search property address"
                className="w-full bg-transparent text-[16px] text-[#222222] outline-none placeholder:text-[#222222] md:text-[20px]"
              />

              {isSearching ? (
                <LoaderCircle
                  size={21}
                  className="animate-spin text-[#717171]"
                />
              ) : (
                <Search
                  size={21}
                  className="text-[#717171]"
                />
              )}
            </div>

            {/* SEARCH RESULTS */}

            {suggestions.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-lg">
                {suggestions.map((feature, index) => (
                  <button
                    key={`${feature.geometry.coordinates.join(",")}-${index}`}
                    type="button"
                    onClick={() =>
                      handleLocationSelect(feature)
                    }
                    className="flex w-full items-center gap-4 border-b border-[#EEEEEE] px-5 py-4 text-left text-[#222222] last:border-0 hover:bg-[#F7F7F7]"
                  >
                    <MapPin
                      size={20}
                      className="shrink-0 text-[#717171]"
                    />

                    <span className="text-sm">
                      {formatAddress(feature)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchError && (
              <p
                role="alert"
                className="mt-2 rounded-lg bg-white p-3 text-sm text-red-600 shadow"
              >
                {searchError}
              </p>
            )}
          </div>

          {/* MAP INSTRUCTIONS */}

          <div className="pointer-events-none absolute top-1/2 left-1/2 z-[600] -translate-x-1/2 translate-y-12">
            <p className="whitespace-nowrap rounded-full bg-[#222222] px-5 py-3 text-sm font-semibold text-white shadow-md">
              Drag the map to reposition the pin
            </p>
          </div>

          {/* SELECTED LOCATION */}

          <div className="absolute right-4 bottom-5 z-[600] max-w-[75%] rounded-xl bg-white px-4 py-3 shadow-md md:right-5">
            <p className="text-xs text-[#717171]">
              Selected location
            </p>

            <p className="mt-1 truncate text-sm font-medium text-[#222222]">
              {isResolvingAddress
                ? "Finding address..."
                : address}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export const Location = memo(LocationComponent);

export default Location;