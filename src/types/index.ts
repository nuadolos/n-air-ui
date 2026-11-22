export interface Airport {
  code: string;
  city: string;
  timezone: string;
}
export interface Flight {
  id: string;
  number: string;
  airline: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  price: number;
  aircraft: string;
  available: number;
}
export interface CartItem {
  key: string;
  flight: Flight;
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
}
export interface BookingInput {
  item: CartItem;
  passenger: string;
  firstName: string;
  lastName: string;
  owner: string;
}
export interface Booking {
  id: string;
  locator: string;
  seat: string;
  input: BookingInput;
  total: number;
  checkedIn: boolean;
}
