import logo from './logo.svg';
import './App.css';
import dairies from './dairy.json';
import volumes from './volumes.json';
import React, { useState, useEffect } from 'react'

function getPrettyVolume(ounceQty) {
  let roundedOunces = Math.round(ounceQty);
  let quarterOunces = Math.round(Math.round(ounceQty * 4) / 4 * 100) / 100;
  let rounded100Ounces = Math.round(ounceQty * 100);

  // if a third of a tsp
  if (rounded100Ounces === 4) {
    return "1/4 teaspoon";
  }

  if (rounded100Ounces === 8) {
    return "1/2 teaspoon";
  }

  if (rounded100Ounces === 13) {
    return "3/4 teaspoon"
  }

  if (rounded100Ounces === 17) {
    return "1 teaspoon"
  }

  if (rounded100Ounces === 33) {
    return "2 teaspoons"
  }
  
  if (rounded100Ounces === 50) {
    return "1 tablespoon"
  }
  
  if (rounded100Ounces === 100) {
    return "2 tablespoons"
  }
  
  if (rounded100Ounces === 150) {
    return "3 tablespoons"
  }

  if (ounceQty < 2) {
    return `${ quarterOunces } ${ quarterOunces > 1 || quarterOunces === 0 ? "ounces" : "ounce" }`;
  }

  if (roundedOunces % 8 === 0) {
    return `${ roundedOunces / 8 } ${ roundedOunces / 8 > 1 ? "cups" : "cup" }`;
  }

  if (roundedOunces % 4 === 0) {
    return `${ roundedOunces / 8 } ${ roundedOunces / 8 > 1 ? "cups" : "cup" }`;
  }

  if (roundedOunces % 2 === 0) {
    return `${ roundedOunces / 8 } ${ roundedOunces / 8 > 1 ? "cups" : "cup" }`;
  }

  return `${ quarterOunces } ${ quarterOunces > 1 || quarterOunces === 0 ? "ounces" : "ounce" }`;
}

function getOutputInstructions(targetVolume, targetUnit, targetDairy, starterDairy1, starterDairy2) {
  if (targetVolume <= 0) {
    return "";
  }

  const targetOunces = targetVolume * targetUnit.ounces
  
  let dairyHigh = starterDairy1;
  let dairyLow = starterDairy2;

  if (starterDairy2.fatContent > starterDairy1.fatContent) {
    dairyHigh = starterDairy2;
    dairyHigh = starterDairy1;
  }

  if (dairyHigh.fatContent < targetDairy.fatContent || dairyLow.fatContent > targetDairy.fatContent) {
    return `Cannot get ${ targetDairy.name } from ${ starterDairy1.name } and ${ starterDairy2.name }.`;
  }

  const fatHighOunces = (targetDairy.fatContent - dairyLow.fatContent) / (dairyHigh.fatContent - dairyLow.fatContent) * targetOunces;
  const fatLowOunces = targetOunces - fatHighOunces;



  return `To get ${ targetVolume } ${ targetVolume > 1 ? targetUnit.namePlural : targetUnit.name } 
    of ${ targetDairy.name }, use ${ getPrettyVolume(fatHighOunces) } 
    of ${ dairyHigh.name } and ${ getPrettyVolume(fatLowOunces) } 
    ${ dairyLow.name }.`
}

function App() {
  const [dairy1, setDairy1] = useState("2")
  const [dairy2, setDairy2] = useState("7")
  const [desiredQty, setDesiredQty] = useState("")
  const [desiredQtyUnit, setDesiredQtyUnit] = useState("1")
  const [desiredDairy, setDesiredDairy] = useState("5")
  const [outputInstructions, setOutputInstructions] = useState("")

  useEffect(() => {
    setOutputInstructions(getOutputInstructions(
      desiredQty, 
      volumes.filter(v => v.id === desiredQtyUnit)[0],
      dairies.filter(d => d.id === desiredDairy)[0],
      dairies.filter(d => d.id === dairy1)[0],
      dairies.filter(d => d.id === dairy2)[0])
    );
  }, [dairy1, dairy2, desiredQty, desiredQtyUnit, desiredDairy]);

  return (
    <div>
      <form>
        <p>I have 
          <select value={dairy1} onChange={e => setDairy1(e.target.value)}>
            {dairies.map(d => {
              return <option key={d.id} value={d.id}>{d.name}</option>
            })}
          </select> and 
          <select value={dairy2} onChange={e => setDairy2(e.target.value)}>
            {dairies.map(d => {
              return <option key={d.id} value={d.id}>{d.name}</option>
            })}
          </select>. I want 
          <input type="number" value={desiredQty} onChange={e => setDesiredQty(e.target.value)} /> 
          <select value={desiredQtyUnit} onChange={e => setDesiredQtyUnit(e.target.value)}>
            {volumes.map(v => {
              return <option key={v.id} value={v.id}>{v.namePlural}</option>
            })}
            </select> of 
            <select value={desiredDairy} onChange={e => setDesiredDairy(e.target.value)}>
            {dairies.map(d => {
              return <option key={d.id} value={d.id}>{d.name}</option>
            })}
          </select>.</p>
      </form>
      <p>{outputInstructions}</p>
    </div>
  );
}

export default App;
