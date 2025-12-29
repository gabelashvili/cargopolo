import type { LotDetails } from "../types/common";

const IAAI_VEHICLE_URL_PATTERN = /^https:\/\/www\.iaai\.com\/VehicleDetail\/\d+~[^/]+$/;

export function isIaaiVehicleUrl(url: string) {
  return IAAI_VEHICLE_URL_PATTERN.test(url);
}

export async function parseIaai(): Promise<LotDetails | null> {
  try {
    const response = await fetch(window.location.href);
    const body = await response.text() as string;
    const openTagRegex = /<script[^>]*id=["']ProductDetailsVM["'][^>]*>/i;
    const openMatch = body.match(openTagRegex);
    if (!openMatch) return null;

    const openTag = openMatch[0];
    const startIndex = body.indexOf(openTag);
    if (startIndex === -1) return null;

    const jsonStart = startIndex + openTag.length;
    const endIndex = body.indexOf("</script>", jsonStart);
    if (endIndex === -1) return null;

    const data = JSON.parse(body.slice(jsonStart, endIndex).trim());

    let engineType = data.inventoryView.attributes.FuelTypeCode;

    if (engineType?.toLowerCase()?.includes("diesel")) {
      engineType = "diesel";
    } else if (engineType?.toLowerCase()?.includes("gas")) {
      engineType = "gasoline";
    } else if (engineType?.toLowerCase()?.includes("hybrid")) {
      engineType = "hybrid";
    } else if (engineType?.toLowerCase()?.includes("electric")) {
      engineType = "electric";
    }
    return {
      auction: "iaai",
      saleCity: data.inventoryView.attributes.City,
      saleState: data.inventoryView.attributes.State,
      releaseYear: parseInt(data.inventoryView.attributes.Year) as number,
      engineInformation: data.inventoryView.attributes.EngineInformation,
      engineType,
    };
  } catch (error) {
    console.error("[Cargopolo] Failed to parse IAAI lot details:", error);
    return null;
  }
}
