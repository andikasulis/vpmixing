import React, { useState } from "react";

function App() {
  const [totalMass, setTotalMass] = useState("");
  const [percentageNitro, setPercentageNitro] = useState("");
  const [percentageM5, setPercentageM5] = useState("");
  const [fuelType, setFuelType] = useState("Nitro+");

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const calculateVolumeAndAFR = () => {
    setError(null);

    const totalMassValue = parseFloat(totalMass);
    const percentageNitroValue = parseFloat(percentageNitro) / 100;
    const percentageM5Value = parseFloat(percentageM5) / 100;

    if (
      isNaN(totalMassValue) ||
      isNaN(percentageNitroValue) ||
      isNaN(percentageM5Value)
    ) {
      setError("Harap masukkan angka yang valid..");
      return;
    }

    if (
      Math.abs(percentageNitroValue + percentageM5Value - 1.0) > 0.0001
    ) {
      setError("Total persentase Nitro+ dan M5 harus 100%.");
      return;
    }

    // Tentukan AFR dan densitas berdasarkan jenis bahan bakar
    let afrFuel, densityFuel;
    if (fuelType === "Nitro+") {
      afrFuel = 14.7;
      densityFuel = 0.74;
    } else if (fuelType === "V-Power") {
      afrFuel = 14.7; // Nilai AFR untuk Shell V-Power
      densityFuel = 0.72; // Nilai densitas untuk Shell V-Power
    }

    const densityM5 = 0.80;

    const massFuel = totalMassValue * percentageNitroValue;
    const massM5 = totalMassValue * percentageM5Value;

    const volumeFuel = massFuel / densityFuel;
    const volumeM5 = massM5 / densityM5;

    const totalVolume = volumeFuel + volumeM5;
    const lubeVolume = totalVolume * (5.0 / 1000.0);

    const afrM5 = 6.5;
    const afrMixture =
      1 / (percentageNitroValue / afrFuel + percentageM5Value / afrM5);

    const afrRich = afrMixture * 0.9;
    const afrLean = afrMixture * 1.05;

    setResults({
      volumeFuel: volumeFuel.toFixed(2),
      volumeM5: volumeM5.toFixed(2),
      totalVolume: totalVolume.toFixed(2),
      lubeVolume: lubeVolume.toFixed(2),
      afrMixture: afrMixture.toFixed(2),
      afrRich: afrRich.toFixed(2),
      afrLean: afrLean.toFixed(2),
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hitung Volume Bahan Bakar & AFR</h1>
      <div style={styles.card}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateVolumeAndAFR();
          }}
        >
          <div style={styles.inputGroup}>
            <label>Total Massa (gram):</label>
            <input
              type="number"
              style={styles.input}
              value={totalMass}
              onChange={(e) => setTotalMass(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Persentase Nitro+ (0-100):</label>
            <input
              type="number"
              step="0.01"
              style={styles.input}
              value={percentageNitro}
              onChange={(e) => setPercentageNitro(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Persentase M5 (0-100):</label>
            <input
              type="number"
              step="0.01"
              style={styles.input}
              value={percentageM5}
              onChange={(e) => setPercentageM5(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Pilih Jenis Bahan Bakar:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="Nitro+"
                  checked={fuelType === "Nitro+"}
                  onChange={(e) => setFuelType(e.target.value)}
                />
                Shell Nitro+
              </label>
              <label>
                <input
                  type="radio"
                  value="V-Power"
                  checked={fuelType === "V-Power"}
                  onChange={(e) => setFuelType(e.target.value)}
                />
                Shell V-Power
              </label>
            </div>
          </div>
          <button type="submit" style={styles.button}>
            Hitung
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {results && (
          <div style={styles.result}>
            <h2>Hasil Perhitungan:</h2>
            <p>
              Volume {fuelType}: {results.volumeFuel} ml
            </p>
            <p>Volume M5: {results.volumeM5} ml</p>
            <p>Total Volume: {results.totalVolume} ml</p>
            <p>Volume Lube: {results.lubeVolume} ml</p>
            <h2>AFR Target:</h2>
            <p>AFR Campuran (Stoikiometri): {results.afrMixture}</p>
            <p>AFR Tenaga Maksimum (Rich): {results.afrRich}</p>
            <p>AFR Efisiensi Lebih Baik (Lean): {results.afrLean}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f8fc",
    fontFamily: "Arial, sans-serif",
    padding: "10px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: {
    marginBottom: "20px",
    color: "#333333",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  input: {
    padding: "8px",
    border: "1px solid #cccccc",
    borderRadius: "5px",
    marginTop: "5px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
    color: "#333333",
  },
};

export default App;
