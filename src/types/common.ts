export interface LotDetails {
  auction: "iaai" | "copart";
  saleCity: string;
  saleState: string;
  releaseYear: number;
  engineInformation: string;
  engineType: string;
}

export type Auction = "iaai" | "copart";
