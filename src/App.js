import React, { useState } from "react";

function App() {
  // State untuk input
  const [totalMass, setTotalMass] = useState("");
  const [percentageNitro, setPercentageNitro] = useState("");
  const [percentageM5, setPercentageM5] = useState("");

  // State untuk hasil
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Fungsi hitung volume dan AFR
  const calculateVolumeAndAFR = () => {
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
      setError("Total persentase Nitro+ dan M5 harus 100%.");
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

    // Perhitungan AFR Campuran
    const afrNitro = 13.0; // AFR Shell Nitro+
    const afrM5 = 6.5; // AFR M5
    const afrMixture = 1 / (percentageNitroValue / afrNitro + percentageM5Value / afrM5);

    // AFR Target
    const afrRich = afrMixture * 0.9; // Untuk tenaga maksimum (rich)
    const afrLean = afrMixture * 1.05; // Untuk efisiensi lebih baik (lean)

    // Simpan hasil ke state
    setResults({
      volumeNitro: volumeNitro.toFixed(2),
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
            <label>Persentase Nitro+ (0-1):</label>
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
            <label>Persentase M5 (0-1):</label>
            <input
              type="number"
              step="0.01"
              style={styles.input}
              value={percentageM5}
              onChange={(e) => setPercentageM5(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Hitung
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {results && (
          <div style={styles.result}>
            <h2>Hasil Perhitungan:</h2>
            <p>Volume Nitro+: {results.volumeNitro} ml</p>
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
    height: "100vh",
    backgroundColor: "#f7f8fc",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  title: {
    marginBottom: "20px",
    color: "#333333",
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
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
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
