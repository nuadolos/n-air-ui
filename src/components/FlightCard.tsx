import { Box, Button, Card, Stack, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import FlightIcon from "@mui/icons-material/Flight";
import { Link } from "react-router-dom";
import type { Flight } from "../types";
import { date, time, money, duration } from "../utils/format";
// Props передаются родителем: flight содержит рейс, showAction управляет блоком выбора
export function FlightCard({
  flight,
  showAction = true,
}: {
  flight: Flight;
  showAction?: boolean;
}) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="body2" fontWeight={600} mb={2.5}>
        {flight.airline}{" "}
        <Box component="span" color="text.secondary" ml={1}>
          {flight.number}
        </Box>
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        spacing={3}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Box sx={{ minWidth: 80 }}>
            <Typography variant="h2">
              {time(flight.departure, flight.from.timezone)}
            </Typography>
            <Typography fontWeight={600}>{flight.from.code}</Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.from.city}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {date(flight.departure, flight.from.timezone)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center", minWidth: 65 }}>
            <Typography variant="caption" color="text.secondary">
              {duration(flight.departure, flight.arrival)}
            </Typography>
            <Stack direction="row" alignItems="center">
              <Box sx={{ height: 1, bgcolor: "#D4D4D8", flex: 1 }} />
              <FlightIcon
                sx={{
                  transform: "rotate(90deg)",
                  fontSize: 20,
                  color: "#A1A1AA",
                }}
              />
              <Box sx={{ height: 1, bgcolor: "#D4D4D8", flex: 1 }} />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Прямой рейс
            </Typography>
          </Box>
          <Box sx={{ minWidth: 80, textAlign: "right" }}>
            <Typography variant="h2">
              {time(flight.arrival, flight.to.timezone)}
            </Typography>
            <Typography fontWeight={600}>{flight.to.code}</Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.to.city}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {date(flight.arrival, flight.to.timezone)}
            </Typography>
          </Box>
        </Stack>
        {showAction && (
          <Box
            sx={{
              minWidth: 170,
              borderLeft: { md: "1px solid #E4E4E7" },
              pl: { md: 3 },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Стоимость от
            </Typography>
            <Typography variant="h3" mb={1.5}>
              {money(flight.price)}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to={`/flights/${flight.id}`}
              endIcon={<ArrowForward fontSize="small" />}
            >
              Выбрать рейс
            </Button>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
