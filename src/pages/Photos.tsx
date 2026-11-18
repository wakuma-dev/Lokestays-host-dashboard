import {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
} from "react";

import { Helmet } from "react-helmet-async";
import { Camera, ImagePlus, X } from "lucide-react";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { updatePropertyDraft } from "@/features/onboarding/api/onboarding.api";

import {
  type PropertyPhoto,
} from "@/features/onboarding/service/cloudinary.service";
import {
  uploadPropertyPhotos,
} from "@/features/onboarding/lib/uploadPropertyPhotos";

const MAX_PHOTOS = 20;
const MIN_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

interface LocalPhoto {
  readonly id: string;
  readonly file: File;
  readonly previewUrl: string;
}

function PhotosComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const objectUrlsRef = useRef<Map<string, string>>(new Map());

  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retain successful Cloudinary uploads if Firestore persistence fails.
  // This prevents duplicate Cloudinary uploads when the user retries.
  const [uploadedByLocalId, setUploadedByLocalId] = useState<
    Map<string, PropertyPhoto>
  >(new Map());

  const photos = useOnboardingStore((state) => state.photos);
  const draftId = useOnboardingStore((state) => state.draftId);

  const setPhotos = useOnboardingStore((state) => state.setPhotos);
  const removePhoto = useOnboardingStore((state) => state.removePhoto);

  const totalPhotos = photos.length + localPhotos.length;

  const canContinue = photos.length >= MIN_PHOTOS;

  // Release temporary browser object URLs.
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      objectUrlsRef.current.clear();
    };
  }, []);

  // Add selected image files.
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (isUploading) return;

      setError(null);

      const selectedFiles = Array.from(files);

      if (selectedFiles.length === 0) return;

      const remainingSlots = MAX_PHOTOS - totalPhotos;

      if (remainingSlots <= 0) {
        setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
        return;
      }

      const validPhotos: LocalPhoto[] = [];
      const errors: string[] = [];

      const existingFiles = new Set(
        localPhotos.map(
          (photo) =>
            `${photo.file.name}-${photo.file.size}-${photo.file.lastModified}`,
        ),
      );

      for (const file of selectedFiles) {
        if (validPhotos.length >= remainingSlots) {
          errors.push(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
          break;
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
          errors.push(`${file.name}: Unsupported image format.`);
          continue;
        }

        if (file.size === 0 || file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: Maximum file size is 10 MB.`);
          continue;
        }

        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

        if (existingFiles.has(fileKey)) {
          continue;
        }

        existingFiles.add(fileKey);

        const previewUrl = URL.createObjectURL(file);

        const photo: LocalPhoto = {
          id: crypto.randomUUID(),
          file,
          previewUrl,
        };

        objectUrlsRef.current.set(photo.id, previewUrl);

        validPhotos.push(photo);
      }

      if (validPhotos.length > 0) {
        setLocalPhotos((previous) => [
          ...previous,
          ...validPhotos,
        ]);
      }

      if (errors.length > 0) {
        setError(errors[0]);
      }

      if (validPhotos.length === 0 && errors.length === 0) {
        setError("These photos have already been selected.");
      }
    },
    [isUploading, localPhotos, totalPhotos],
  );

  // Open native file picker.
  const handleOpenPicker = () => {
    if (isUploading) return;

    if (totalPhotos >= MAX_PHOTOS) {
      setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    inputRef.current?.click();
  };

  // Remove temporary photo.
  const handleRemoveLocalPhoto = (photoId: string) => {
    if (isUploading) return;

    const previewUrl = objectUrlsRef.current.get(photoId);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      objectUrlsRef.current.delete(photoId);
    }

    setLocalPhotos((previous) =>
      previous.filter((photo) => photo.id !== photoId),
    );

    setUploadedByLocalId((previous) => {
      const updated = new Map(previous);
      updated.delete(photoId);
      return updated;
    });

    setError(null);
  };

  // Upload photos and persist their metadata.
  const handleUploadPhotos = async () => {
    if (isUploading) return;

    if (!draftId) {
      setError("Property draft not found. Please restart the onboarding process.");
      return;
    }

    if (localPhotos.length === 0) {
      setError("Please select photos before uploading.");
      return;
    }

    if (totalPhotos > MAX_PHOTOS) {
      setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const nextUploadedPhotos = new Map(uploadedByLocalId);

      // Only upload files that haven't already succeeded.
      const pendingPhotos = localPhotos.filter(
        (photo) => !nextUploadedPhotos.has(photo.id),
      );

      if (pendingPhotos.length > 0) {
        const existingPositions = [
          ...photos.map((photo) => photo.position),
          ...Array.from(nextUploadedPhotos.values()).map(
            (photo) => photo.position,
          ),
        ];

        const startingPosition =
          existingPositions.length > 0
            ? Math.max(...existingPositions) + 1
            : 0;

        const uploadResult = await uploadPropertyPhotos(
          pendingPhotos.map((photo) => photo.file),
          startingPosition,
        );

        // Associate successful uploads with their original local files.
        for (const uploadedPhoto of uploadResult.uploadedPhotos) {
          const localIndex = uploadedPhoto.position - startingPosition;
          const localPhoto = pendingPhotos[localIndex];

          if (localPhoto) {
            nextUploadedPhotos.set(localPhoto.id, uploadedPhoto);
          }
        }

        setUploadedByLocalId(new Map(nextUploadedPhotos));
      }

      if (nextUploadedPhotos.size === 0) {
        throw new Error("No photos were uploaded successfully.");
      }

      // Prepare Firestore data in stable position order.
      const successfullyUploaded = localPhotos
        .filter((photo) => nextUploadedPhotos.has(photo.id))
        .map((photo) => nextUploadedPhotos.get(photo.id))
        .filter(
          (photo): photo is PropertyPhoto => photo !== undefined,
        )
        .sort((a, b) => a.position - b.position);

      const updatedPhotos = [
        ...photos,
        ...successfullyUploaded,
      ];

      // Persist before updating Zustand.
      await updatePropertyDraft(draftId, {
        photos: updatedPhotos,
      });

      // Synchronize client state after successful persistence.
      setPhotos(updatedPhotos);

      const completedLocalIds = new Set(
        localPhotos
          .filter((photo) => nextUploadedPhotos.has(photo.id))
          .map((photo) => photo.id),
      );

      // Release previews for successfully persisted photos.
      for (const localPhoto of localPhotos) {
        if (!completedLocalIds.has(localPhoto.id)) continue;

        const previewUrl = objectUrlsRef.current.get(localPhoto.id);

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          objectUrlsRef.current.delete(localPhoto.id);
        }
      }

      // Keep failed photos available for retry.
      setLocalPhotos((previous) =>
        previous.filter((photo) => !completedLocalIds.has(photo.id)),
      );

      setUploadedByLocalId((previous) => {
        const updated = new Map(previous);

        for (const localId of completedLocalIds) {
          updated.delete(localId);
        }

        return updated;
      });

      if (localPhotos.length > successfullyUploaded.length) {
        setError(
          "Some photos could not be uploaded. Please retry the remaining photos.",
        );
      } else {
        setError(null);
      }

    } catch (error: unknown) {
      console.error("Property photo upload failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload photos. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop.
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    handleFiles(event.dataTransfer.files);
  };

  return (
    <main
      className="min-h-0 w-full overflow-x-hidden bg-[#FDFDFD]  p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white"
    >
      <Helmet>
        <title>Add some photos | Lokestays</title>
        <meta
          name="description"
          content="Add photos of your property to your Lokestays listing."
        />
      </Helmet>

      <div className="mx-auto pb-40 flex w-full max-w-2xl flex-col gap-6 md:gap-8">

        {/* Header */}
        <header className="pt-16 md:pt-0 flex flex-col items-start space-y-1">
          <h1 className="text-[26px] font-semibold leading-[30px] tracking-tight md:text-[32px] md:leading-[36px]">
            Add some photos of your house
          </h1>

          <p className="text-[16px] font-normal leading-[20px] text-[#6c6c6c] dark:text-[#A1A1AA] md:text-[18px] md:leading-[24px]">
            You’ll need 5 photos to get started. You can add more or make
            changes later.
          </p>
        </header>

        {/* File input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          disabled={isUploading}
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }

            event.target.value = "";
          }}
        />

        {/* Upload area */}
        {totalPhotos === 0 && (
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node,
                )
              ) {
                setIsDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`flex min-h-[300px] w-full flex-col items-center
            justify-center rounded-2xl border border-dashed
            transition-colors duration-200 md:min-h-[400px]
            ${
              isDragging
                ? "border-black bg-[#F0F0F0] dark:border-white dark:bg-[#202020]"
                : "border-[#A0A0A0] bg-[#FAFAFA] dark:border-[#525252] dark:bg-[#111111]"
            }`}
          >
            <Camera
              size={104}
              strokeWidth={1}
              className="mb-8 text-[#777777] dark:text-[#A1A1AA]"
            />

            <button
              type="button"
              onClick={handleOpenPicker}
              className="rounded-xl bg-[#F1F1F1] px-7 py-3
              text-[16px] font-semibold text-[#201b15]
              transition-colors hover:bg-[#E7E7E7]
              dark:bg-[#252525] dark:text-white
              dark:hover:bg-[#333333]"
            >
              Add photos
            </button>

            <p className="mt-4 text-sm text-[#777777] dark:text-[#A1A1AA]">
              or drag and drop
            </p>
          </div>
        )}

        {/* Selected photos */}
        {totalPhotos > 0 && (
          <section className="flex flex-col gap-5">

            {/* Photo grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

              {/* Previously uploaded photos */}
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={photo.url}
                    alt={`Property photo ${photo.position + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    disabled={isUploading}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex size-8
                    items-center justify-center rounded-full
                    bg-white text-black shadow-md transition
                    hover:scale-105 disabled:opacity-50"
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}

              {/* Locally selected photos */}
              {localPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={photo.previewUrl}
                    alt={photo.file.name}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLocalPhoto(photo.id)}
                    disabled={isUploading}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex size-8
                    items-center justify-center rounded-full
                    bg-white text-black shadow-md transition
                    hover:scale-105 disabled:opacity-50"
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}

              {/* Add more photos */}
              {totalPhotos < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  disabled={isUploading}
                  className="flex aspect-square flex-col items-center
                  justify-center gap-3 rounded-xl border
                  border-dashed border-[#A0A0A0]
                  bg-[#FAFAFA] transition
                  hover:bg-[#F1F1F1]
                  dark:border-[#525252] dark:bg-[#111111]
                  dark:hover:bg-[#202020] disabled:opacity-50"
                >
                  <ImagePlus
                    size={32}
                    strokeWidth={1.5}
                    className="text-[#777777] dark:text-[#A1A1AA]"
                  />

                  <span className="text-sm font-medium">
                    Add photos
                  </span>
                </button>
              )}
            </div>

            {/* Photo counter */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6c6c6c] dark:text-[#A1A1AA]">
                {totalPhotos} of {MAX_PHOTOS} photos
              </p>

              <p className="text-sm font-medium">
                {canContinue
                  ? "Minimum requirement met"
                  : `${Math.max(0, MIN_PHOTOS - photos.length)} more required`}
              </p>
            </div>

            {/* Upload button */}
            {localPhotos.length > 0 && (
              <button
                type="button"
                onClick={handleUploadPhotos}
                disabled={isUploading}
                className="w-full rounded-xl bg-[#201b15] px-6 py-3
                text-sm font-semibold text-white transition
                hover:bg-[#38312a] disabled:cursor-not-allowed
                disabled:opacity-50 dark:bg-white dark:text-black
                dark:hover:bg-[#E5E5E5]"
              >
                {isUploading
                  ? "Uploading photos..."
                  : `Upload ${localPhotos.length} photos`}
              </button>
            )}
          </section>
        )}

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="text-sm font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {/* Upload requirements */}
        <p className="text-sm text-[#777777] dark:text-[#A1A1AA]">
          JPG, JPEG, PNG or WEBP or AVIF. Maximum 10 MB per photo.
        </p>
      </div>
    </main>
  );
}

export const Photos = memo(PhotosComponent);

export default Photos;