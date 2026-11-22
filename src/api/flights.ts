import type { Flight } from "../types";
import { client } from "./client";
import {
  airportCity,
  airlineName,
  usdToRub,
  USD_TO_RUB,
} from "../utils/localization";
interface ApiAirport {
  iata: string;
  timezone: string;
}
interface ApiFlight {
  id: number;
  number: string;
  airline: { name: string };
  origin_airport: ApiAirport;
  destination_airport: ApiAirport;
  scheduled_departure: string;
  scheduled_arrival: string;
  base_fare: number;
  aircraft: string;
  seats_available: number;
}
const expand = "airline,origin_airport,destination_airport";
function mapFlight(flight: ApiFlight): Flight {
  if (
    !flight.airline ||
    !flight.origin_airport ||
    !flight.destination_airport ||
    !Number.isFinite(flight.base_fare) ||
    flight.base_fare < 0 ||
    !Number.isFinite(Date.parse(flight.scheduled_departure)) ||
    !Number.isFinite(Date.parse(flight.scheduled_arrival))
  )
    throw Error("Сервер вернул неполные данные рейса");
  return {
    id: String(flight.id),
    number: flight.number,
    airline: airlineName(flight.airline.name),
    from: {
      code: flight.origin_airport.iata,
      city: airportCity(flight.origin_airport.iata),
      timezone: flight.origin_airport.timezone,
    },
    to: {
      code: flight.destination_airport.iata,
      city: airportCity(flight.destination_airport.iata),
      timezone: flight.destination_airport.timezone,
    },
    departure: flight.scheduled_departure,
    arrival: flight.scheduled_arrival,
    price: usdToRub(flight.base_fare),
    aircraft: flight.aircraft,
    available: flight.seats_available,
  };
}
export interface FlightQuery {
  page: number;
  airline: string;
  budget: string;
  sort: string;
}
export const initialQuery: FlightQuery = {
  page: 1,
  airline: "",
  budget: "",
  sort: "price",
};
export interface FlightPageResult {
  items: Flight[];
  total: number;
  pages: number;
}
export async function getFlights(
  query: FlightQuery = initialQuery,
  signal?: AbortSignal,
): Promise<FlightPageResult> {
  const budgetInUsd =
    query.budget !== ""
      ? Math.floor((Number(query.budget) * 100) / USD_TO_RUB) / 100
      : undefined;
  const { data } = await client.get<{
    data: ApiFlight[];
    meta: { pages: number; total: number };
  }>("/flights", {
    signal,
    params: {
      page: query.page,
      limit: 20,
      status_in: "scheduled,boarding,delayed",
      seats_available_gt: 0,
      expand,
      airline_id: query.airline || undefined,
      base_fare_lte: budgetInUsd,
      sort: query.sort === "price" ? "base_fare,id" : "scheduled_departure,id",
    },
  });
  if (
    !Array.isArray(data.data) ||
    !Number.isInteger(data.meta?.pages) ||
    !Number.isInteger(data.meta?.total)
  )
    throw Error("Не удалось прочитать каталог");
  return {
    items: data.data.map(mapFlight),
    total: data.meta.total,
    pages: data.meta.pages,
  };
}
export async function getAirlines(): Promise<{ id: string; name: string }[]> {
  const { data } = await client.get<{ data: { id: number; name: string }[] }>(
    "/airlines",
    { params: { limit: 200 } },
  );
  return data.data.map((airline) => ({
    id: String(airline.id),
    name: airlineName(airline.name),
  }));
}
export async function getFlight(id: string): Promise<Flight> {
  const { data } = await client.get<ApiFlight>(
    `/flights/${encodeURIComponent(id)}`,
    { params: { expand } },
  );
  return mapFlight(data);
}
