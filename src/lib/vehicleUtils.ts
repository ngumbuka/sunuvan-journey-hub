import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

export function getVehicleImage(vehicle: Partial<Vehicle>) {
    // Use "black vans with logo" style as requested, but map everything to vans
    // with some color variety based on attributes or ID to keep it interesting but consistent.

    const category = vehicle.category?.toLowerCase() || "";
    const name = vehicle.name?.toLowerCase() || "";
    const idChar = vehicle.id ? vehicle.id.charCodeAt(0) : 0;

    // Large/Groups -> Sprinters
    if (category === "minibus" || vehicle.passengers! > 7) {
        // Alternate between black and white sprinters based on ID
        return idChar % 2 === 0 ? "/vehicles/van-large.png" : "/vehicles/van-large-black.png";
    }

    // Premium/Luxury -> V-Class (Black or Silver)
    if (category === "premium" || category === "luxury") {
        return "/vehicles/van-premium.png"; // Keep premium consistently black for high-end feel
    }

    // Standard/Others -> Map to Silver or Black V-Class
    // User said "only vans", so even sedans become vans in this visual update
    return idChar % 2 === 0 ? "/vehicles/van-silver.png" : "/vehicles/van.png";
}
