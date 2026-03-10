export type RoomType = 'singola' | 'doppia' | 'deluxe' | 'suite';


export interface Room {
  id: number;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number; // EUR
  capacity: number;      // max guests
  size: number;          // m²
  floor: number;
  roomNumber: number;
  amenities: string[];
  images: string[];
  available: boolean;
}
