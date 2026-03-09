export type RoomType = 'single' | 'double' | 'deluxe' | 'suite' | 'penthouse';

export type RoomView = 'sea' | 'garden' | 'city' | 'pool' | 'mountain';

export interface Room {
  id: int;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number; // EUR
  capacity: number;      // max guests
  size: number;          // m²
  floor: number;
  view: RoomView;
  amenities: string[];
  images: string[];
  available: boolean;
}
