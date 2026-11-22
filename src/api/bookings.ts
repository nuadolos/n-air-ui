import type { Booking, BookingInput } from "../types";
import { client } from "./client";
import { usdToRub } from "../utils/localization";
export async function createBooking(input: BookingInput): Promise<Booking> {
  const { data } = await client.post("/bookings", {
    flight_id: Number(input.item.flight.id),
    passenger: {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.owner,
    },
    cabin: "economy",
  });
  if (
    data.id === undefined ||
    typeof data.locator !== "string" ||
    typeof data.seat !== "string" ||
    !Number.isFinite(data.fare) ||
    data.fare < 0 ||
    data.currency !== "USD"
  )
    throw Error("Не получено подтверждение бронирования");
  return {
    id: String(data.id),
    locator: data.locator,
    seat: data.seat,
    input,
    total: usdToRub(data.fare),
    checkedIn: data.status === "checked_in",
  };
}
export async function checkInBooking(booking: Booking) {
  const { data } = await client.patch(
    `/bookings/${encodeURIComponent(booking.id)}`,
    { status: "checked_in" },
  );
  if (data.status !== "checked_in")
    throw Error("Сервер не подтвердил регистрацию");
}
