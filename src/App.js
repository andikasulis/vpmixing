import React, { useState } from "react";

function App() {
  // State untuk input
  const [totalMass, setTotalMass] = useState("");
  const [percentageNitro, setPercentageNitro] = useState("");
  const [percentageM5, setPercentageM5] = useState("");

  // State untuk hasil
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Fungsi hitung volume
  const calculateVolume = () => {
    setError(null);

    const totalMassValue = parseFloat(totalMass);
    const percentageNitroValue = parseFloat(percentageNitro);
    const percentageM5Value = parseFloat(percentageM5);

    // Validasi input
    if (
      isNaN(totalMassValue) ||
      isNaN(percentageNitroValue) ||
      isNaN(percentageM5Value)
    ) {
      setError("Harap masukkan angka yang valid.");
      return;
    }

    if (Math.abs(percentageNitroValue + percentageM5Value - 1.0) > Number.EPSILON) {
      setError("Persentase Nitro+ dan M5 harus berjumlah 100%.");
      return;
    }

    // Densitas bahan bakar
    const densityNitro = 0.74; // g/ml
    const densityM5 = 0.80; // g/ml

    // Hitung massa masing-masing bahan bakar
    const massNitro = totalMassValue * percentageNitroValue;
    const massM5 = totalMassValue * percentageM5Value;

    // Hitung volume masing-masing bahan bakar
    const volumeNitro = massNitro / densityNitro;
    const volumeM5 = massM5 / densityM5;

    // Hitung total volume bahan bakar
    const totalVolume = volumeNitro + volumeM5;

    // Hitung volume lube (5 ml per 1000 ml)
    const lubeVolume = totalVolume * (5.0 / 1000.0);

    // Simpan hasil ke state
    setResults({
      volumeNitro: volumeNitro.toFixed(2),
      volumeM5: volumeM5.toFixed(2),
      totalVolume: totalVolume.toFixed(2),
      lubeVolume: lubeVolume.toFixed(2),
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Hitung Volume Bahan Bakar</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateVolume();
        }}
      >
        <div>
          <label>Total Massa (gram): </label>
          <input
            type="number"
            value={totalMass}
            onChange={(e) => setTotalMass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Persentase Nitro+ (0-1): </label>
          <input
            type="number"
            step="0.01"
            value={percentageNitro}
            onChange={(e) => setPercentageNitro(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Persentase M5 (0-1): </label>
          <input
            type="number"
            step="0.01"
            value={percentageM5}
            onChange={(e) => setPercentageM5(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Hitung
        </button>
      </form>

      {/* Menampilkan Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Menampilkan Hasil */}
      {results && (
        <div style={{ marginTop: "20px" }}>
          <h2>Hasil Perhitungan:</h2>
          <p>Volume Nitro+: {results.volumeNitro} ml</p>
          <p>Volume M5: {results.volumeM5} ml</p>
          <p>Total Volume: {results.totalVolume} ml</p>
          <p>Volume Lube: {results.lubeVolume} ml</p>
        </div>
      )}
    </div>
  );
}

export default App;
