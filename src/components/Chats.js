import React, { useState, useEffect } from "react";
import { PivotTableUI, TableRenderers } from 'react-pivottable';
import "react-pivottable/pivottable.css";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

const Chats = ({ chats }) => {
  // create Plotly renderers via dependency injection
  const PlotlyRenderers = createPlotlyRenderers(Plot);

  // see documentation for supported input formats
  const [data, setData] = useState({
    data: chats,
    rows: ["campaign", "seller"],
    cols: ["tiempoTotal"],
    rendererName: "Stacked Column Chart",
  });

  useEffect(() => {
    let tablePivot = document.getElementsByClassName("pvtTable");
    if (tablePivot && tablePivot[0]) tablePivot[0].id = "table-pivot";
  }, []);

  return (
    <PivotTableUI
      id="table-pivot"
      onChange={(s) => setData(s)}
      {...data}
      renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
    />
  );
};

export default Chats;
