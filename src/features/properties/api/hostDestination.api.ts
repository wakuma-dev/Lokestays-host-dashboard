import { z } from "zod";
import { hasHostProperties } from "@/features/properties";
export type HostDestinationRoute = "/en" | "/properties/create";

const HostIdSchema = z.string().min(1, { message: "Host ID cannot be empty or whitespace" });

export async function getHostDestination(hostId: unknown): Promise<HostDestinationRoute> {
  const validationResult = HostIdSchema.safeParse(hostId);
  if (!validationResult.success) {
    throw new Error(`[ValidationError] Invalid hostId parameter provided to routing layer: ${validationResult.error.message}`);
  }

  const sanitizedHostId = validationResult.data.trim();

  try {
    const hasProperties = await hasHostProperties(sanitizedHostId);
    return hasProperties ? "/en" : "/properties/create";
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown persistence layer fault";
    throw new Error(`[RoutingError] Failed to determine destination for host [${sanitizedHostId}]: ${errorMessage}`);
  }
}