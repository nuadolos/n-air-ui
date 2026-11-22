import { MenuItem, Stack, TextField } from "@mui/material";
import { formatCardNumber } from "../utils/booking";
export interface CardValue {
  number: string;
  month: string;
  year: string;
  cvc: string;
}
export const emptyCard: CardValue = {
  number: "",
  month: "",
  year: "",
  cvc: "",
};
export function CardFields({
  value,
  onChange,
  disabled = false,
}: {
  value: CardValue;
  onChange: (value: CardValue) => void;
  disabled?: boolean;
}) {
  const { number, month, year, cvc } = value;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const months = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0"),
  );
  const years = Array.from({ length: 16 }, (_, index) => currentYear + index);
  return (
    <Stack spacing={2}>
      <TextField
        required
        label="Номер карты"
        value={number}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...value, number: formatCardNumber(event.target.value) })
        }
        autoComplete="cc-number"
        slotProps={{
          htmlInput: { inputMode: "numeric", maxLength: 19 },
        }}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          required
          select
          label="Месяц"
          value={month}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...value, month: event.target.value })
          }
        >
          {months.map((monthOption) => (
            <MenuItem
              key={monthOption}
              value={monthOption}
              disabled={
                Number(year) === currentYear &&
                Number(monthOption) < currentMonth
              }
            >
              {monthOption}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          select
          label="Год"
          value={year}
          disabled={disabled}
          onChange={(event) => {
            onChange({
              ...value,
              year: event.target.value,
              month:
                Number(event.target.value) === currentYear &&
                Number(month) < currentMonth
                  ? ""
                  : month,
            });
          }}
        >
          {years.map((yearOption) => (
            <MenuItem key={yearOption} value={String(yearOption)}>
              {yearOption}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          label="CVC"
          type="password"
          value={cvc}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              ...value,
              cvc: event.target.value.replace(/\D/g, "").slice(0, 3),
            })
          }
          slotProps={{
            htmlInput: { inputMode: "numeric", maxLength: 3 },
          }}
        />
      </Stack>
    </Stack>
  );
}
