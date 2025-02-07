import React, { useState, useCallback } from "react";
import Plot from "react-plotly.js";
import * as math from "mathjs";
import './App.css'

function App() {
  // State variables for user inputs
  const [learningRate, setLearningRate] = useState(0.1);
  const [iterations, setIterations] = useState(20);
  const [initialX, setInitialX] = useState(5);
  const [userFunction, setUserFunction] = useState("x^2");
  const [xValues, setXValues] = useState([initialX]);
  const [yValues, setYValues] = useState([initialX**2]);
  
  // default function for landing page
  let parsedFunc = (x) => math.evaluate("x^2", { x });
  let parsedGrad = math.derivative("x^2", 'x');

  let xPlot_i = [];
  let yPlot_i = [];
  for (let i = -6; i <= 6; i += 0.1) {
    xPlot_i.push(i);
    yPlot_i.push(parsedFunc(i));
  }
  
  const [xPlot, setXPlot] = useState(xPlot_i);
  const [yPlot, setYPlot] = useState(yPlot_i);

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // Function to handle gradient descent
  const startGradientDescent = () => {
    parsedFunc = (x) => math.evaluate(userFunction, { x });
    parsedGrad = math.derivative(userFunction, 'x');

    let xPl = []
    let yPl = []

    for (let i = -6; i <= 6; i += 0.1) {
      xPl.push(i);
      yPl.push(parsedFunc(i));
    }
    
    setXPlot(xPl);
    setYPlot(yPl);

    let xVals = [initialX];
    let yVals = [parsedFunc(initialX)];

    let currentX = initialX;
    for (let i = 0; i < iterations; i++) {
      let grad = parsedGrad.evaluate({'x': currentX})
      currentX -= learningRate * grad; // Gradient descent update
      xVals.push(currentX);
      yVals.push(parsedFunc(currentX));
      setXValues(xVals);
      setYValues(yVals);
      sleep(1000);
    }

    //setXValues(xVals);
    //setYValues(yVals);
  };

  const trace1 = {
    x: xPlot,
    y: yPlot,
    type: "scatter",
    mode: "lines",
    name: `f(x) = ${userFunction}`,
    line: { color: "blue" },
  };

  const trace2 = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "markers+lines",
    name: "Gradient Descent Steps",
    line: { dash: "dot", color: "red" },
    marker: { color: "red", size: 10 },
  };

  const layout = {
    title: `Gradient Descent Optimization of f(x) = ${userFunction}`,
    xaxis: { title: "x" },
    yaxis: { title: "f(x)" },
    showlegend: true,
  };

  return (
    <div className="App">
      <h1>Gradient Descent Visualization</h1>
      <div className="form-container">
        <div className="form-item">
          <label>Learning Rate: </label>
          <input
            type="number"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-item">
          <label>Iterations: </label>
          <input
            type="number"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
          />
        </div>
        <div className="form-item">
          <label>Initial Position (x₀): </label>
          <input
            type="number"
            value={initialX}
            onChange={(e) => setInitialX(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-item">
          <label>Function f(x): </label>
          <input
            type="text"
            value={userFunction}
            onChange={(e) => setUserFunction(e.target.value)}
          />
        </div>
      </div>
      <button onClick={startGradientDescent}>Start Gradient Descent</button>

      <div id="plot">
        <Plot
          data={[trace1, trace2]}
          layout={layout}
          useResizeHandler
          style={{ width: "100%", height: "500px" }}
        />
      </div>
    </div>
  );
}

export default App;
