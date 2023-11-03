import React, { useEffect, useState } from 'react';
import './App.css';
import data from './wineData.json';

function App() {
  const [wineData, setWineData] = useState([]);
  const [flavanoidsStats, setFlavanoidsStats] = useState({});
  const [gammaStats, setGammaStats] = useState({});

  useEffect(() => {
    // Fetch the wine data from the JSON file
    // fetch('/wineData.json')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
        setWineData(data);
        calculateFlavanoidsStats(data);
        calculateGammaStats(data);
  //     })
  //     .catch((error) => console.error('Error fetching JSON file:', error));
  }, []);

  const calculateFlavanoidsStats = (data) => {
    const classStats = {};

    data.forEach((item) => {
      const className = `Class ${item.Alcohol}`;
      if (!classStats[className]) {
        classStats[className] = [];
      }
      classStats[className].push(item.Flavanoids);
    });

    const classWiseStats = {};

    for (const className in classStats) {
      const flavanoidsData = classStats[className];
      const mean = calculateMean(flavanoidsData);
      const median = calculateMedian(flavanoidsData);
      const mode = calculateMode(flavanoidsData);

      classWiseStats[className] = {
        Mean: mean,
        Median: median,
        Mode: mode,
      };
    }

    setFlavanoidsStats(classWiseStats);
  };

  const calculateGammaStats = (data) => {
    const classStats = {};

    data.forEach((item) => {
      const className = `Class ${item.Alcohol}`;
      if (!classStats[className]) {
        classStats[className] = [];
      }
      const gamma = (item.Ash * item.Hue) / item.Magnesium;
      classStats[className].push(gamma);
    });

    const classWiseStats = {};

    for (const className in classStats) {
      const gammaData = classStats[className];
      const mean = calculateMean(gammaData);
      const median = calculateMedian(gammaData);
      const mode = calculateMode(gammaData);

      classWiseStats[className] = {
        Mean: mean,
        Median: median,
        Mode: mode,
      };
    }

    setGammaStats(classWiseStats);
  };

  const calculateMean = (data) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / data.length;
  };

  const calculateMedian = (data) => {
    if (data.length === 0) return 0;
    const sortedData = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sortedData.length / 2);

    if (sortedData.length % 2 === 0) {
      return (sortedData[middle - 1] + sortedData[middle]) / 2;
    } else {
      return sortedData[middle];
    }
  };

  const calculateMode = (data) => {
    if (data.length === 0) return 0;
    const counts = {};
    let maxCount = 0;
    let mode = data[0];

    data.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;

      if (counts[value] > maxCount) {
        maxCount = counts[value];
        mode = value;
      }
    });

    return mode;
  };

  const renderStatsTable = (stats, title) => {
    return (
      <table>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Measure</th>
            {Object.keys(stats).map((className) => (
              <th key={className}>{className}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(stats[Object.keys(stats)[0]]).map((measure) => (
            <tr key={measure}>
              <td>{measure}</td>
              {Object.keys(stats).map((className) => (
                <td key={className}>{stats[className][measure].toFixed(3)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      {Object.keys(flavanoidsStats).length > 0 &&
        renderStatsTable(flavanoidsStats, 'Flavanoids Statistics')}
      {Object.keys(gammaStats).length > 0 &&
        renderStatsTable(gammaStats, 'Gamma Statistics')}
    </div>
  );
}

export default App;
