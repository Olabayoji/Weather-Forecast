import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

export default function Gauge(props) {
  const marks = [
    {
      value: 0,
      label: `${props.min}°`,
    },

    {
      value: 100,
      label: `${props.max}°`,
    },
  ];
  return (
    <Box sx={{ minWidth: 100 }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={props.value}
        getAriaValueText={valuetext}
        step={10}
        valueLabelDisplay="auto"
        // marks={marks}
        disabled
      />
    </Box>
  );
}
