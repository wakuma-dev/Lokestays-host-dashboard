import {
  uploadPropertyPhoto,
  type PropertyPhoto,
} from "../service/cloudinary.service";
const MAX_CONCURRENT_UPLOADS = 4;
export interface PhotoUploadFailure {
  readonly file: File;
  readonly position: number;
  readonly error: Error;
}
export interface PhotoUploadResult {
  readonly uploadedPhotos: readonly PropertyPhoto[];
  readonly failures: readonly PhotoUploadFailure[];
  readonly isSuccessful: boolean;
}
export async function uploadPropertyPhotos(
  files: readonly File[],
  startingPosition: number,
  signal?: AbortSignal,
): Promise<PhotoUploadResult> {
  if (files.length === 0) {
    throw new Error("At least one photo is required.");
  }
  if (
    !Number.isInteger(startingPosition) ||
    startingPosition < 0
  ) {
    throw new Error("Invalid starting photo position.");
  }
  const uploadedPhotos: PropertyPhoto[] = [];
  const failures: PhotoUploadFailure[] = [];
  let nextIndex = 0;
  async function uploadWorker(): Promise<void> {
    while (nextIndex < files.length) {
      if (signal?.aborted) {
        throw new DOMException("Photo upload cancelled.", "AbortError");
      }
      const currentIndex = nextIndex++;
      const file = files[currentIndex];
      const position = startingPosition + currentIndex;
      try {
        const uploadedPhoto = await uploadPropertyPhoto(
          file,
          position,
          signal,
        );
        uploadedPhotos.push(uploadedPhoto);
      } catch (error: unknown) {
        if (signal?.aborted) {
          throw error;
        }
        failures.push({
          file,
          position,
          error:
            error instanceof Error
              ? error
              : new Error("Unknown photo upload error."),
        });
      }
    }
  }
  const workerCount = Math.min(
    MAX_CONCURRENT_UPLOADS,
    files.length,
  );
  const workerResults = await Promise.allSettled(
    Array.from({ length: workerCount }, () => uploadWorker()),
  );
  const unexpectedFailure = workerResults.find(
    (result) => result.status === "rejected",
  );
  if (unexpectedFailure?.status === "rejected") {
    throw unexpectedFailure.reason;
  }
  uploadedPhotos.sort((a, b) => a.position - b.position);
  failures.sort((a, b) => a.position - b.position);
  return {
    uploadedPhotos,
    failures,
    isSuccessful: failures.length === 0,
  };
}