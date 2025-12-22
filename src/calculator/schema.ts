import { z } from "zod";

export const VehicleTypes = {
  sedan: "Sedan",
  smSuv: "Small, Medium SUV",
  bigSuv: "Big SUV",
  van: "Van",
  sprinter: "Sprinter",
  pickup: "Pickup",
  heavyEquip: "Heavy equipment",
  bobCat: "Bob Cat",
  quadricycle: "Quadricycle",
  motorcycle: "Motorcycle",
  truck: "Truck",
  boat: "Boat",
} as const;

export const schema = z.object({
  auction: z.object({
    cost: z.number().min(0, "Cost must be at least 0"),
    feeType: z.enum(["low", "high"]),
    auction: z.enum(["iaai", "copart"]),
  }),
  transportation: z.object({
    vehicleType: z.string(),
    containerType: z.enum(["4 Vehicles", "3 Vehicles"]),
    shippingLocationId: z.number(),
    exitPortId: z.number(),
    deliveryPortId: z.number(),
    insuranceType: z.enum(["basic", "auction", "warehouse"]),
    titleDocumentId: z.number(),
  }),
  expedition: z.object({
    type: z.enum(["selfPickup", "complex", "basic"]),
  }),
});

export type FormData = z.infer<typeof schema>;
