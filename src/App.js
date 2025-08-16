import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCode = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      #Api Turned Off
      const res = await axios.post(
        "https://ruby-code-analyzer-backand.onrender.com/analyze",
        { code },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setResult(res.data.result);
      } else {
        setError(res.data.error || "Unknown backend error");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      setError("Network or backend error. Check console and server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🔍 Ruby Code Analyzer</h1>

      <textarea
        className="w-full h-64 p-4 bg-gray-800 rounded mb-4 text-white"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste Ruby code here..."
      />

      <button
        onClick={analyzeCode}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>

      {error && (
        <div className="mt-4 text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.classes && result.classes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Analysis Result</h2>

          {result.classes.map((cls, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded p-4 mb-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Class: {cls.class_name}
              </h3>
              {cls.superclass && (
                <p className="mb-2 text-gray-300">
                  ↪ Inherits from: {cls.superclass}
                </p>
              )}

              <div className="mb-2">
                <strong>🛠 Methods:</strong>
                <ul className="list-disc ml-6">
                  {cls.methods.map((method, i) => (
                    <li key={i} className="mb-2">
                      <div>
                        <span className="text-yellow-300 font-semibold">
                          {method.name}
                        </span>
                        ({method.arguments.join(", ")}) — line{" "}
                        {method.line_number}
                      </div>

                      <div className="ml-4 mt-1 text-sm">
                        <div>
                          <strong>💡 Instance Variables:</strong>{" "}
                          {method.instance_variables.length > 0
                            ? method.instance_variables
                                .map((v) => `${v.name} (line ${v.line_number})`)
                                .join(", ")
                            : "None"}
                        </div>
                        <div>
                          <strong>📦 Local Variables:</strong>{" "}
                          {method.local_variables.length > 0
                            ? method.local_variables
                                .map((v) => `${v.name} (line ${v.line_number})`)
                                .join(", ")
                            : "None"}
                        </div>
                        <div>
                          <strong>📞 Method Calls:</strong>{" "}
                          {method.method_calls.length > 0
                            ? method.method_calls
                                .map((v) => `${v.name} (line ${v.line_number})`)
                                .join(", ")
                            : "None"}
                        </div>
                        <div>
                          <strong>🔀 Conditionals:</strong>{" "}
                          {method.conditionals.length > 0
                            ? method.conditionals
                                .map(
                                  (c) =>
                                    `${c.condition} (line ${c.line_number})`
                                )
                                .join(", ")
                            : "None"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Top-Level Methods */}
      {result?.top_level?.methods?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">📄 Top-Level Methods</h2>

          {result.top_level.methods.map((method, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded p-4 mb-6 border border-gray-700"
            >
              <h3 className="text-yellow-300 text-lg font-bold mb-2">
                🔧 {method.name}({method.arguments.join(", ")})
              </h3>
              <p className="text-gray-400 mb-2">
                📍 Line: {method.line_number}
              </p>

              <div className="mb-2">
                <strong>💡 Instance Variables:</strong>{" "}
                {method.instance_variables.length > 0
                  ? method.instance_variables
                      .map((v) => `${v.name} (line ${v.line_number})`)
                      .join(", ")
                  : "None"}
              </div>

              <div className="mb-2">
                <strong>📦 Local Variables:</strong>{" "}
                {method.local_variables.length > 0
                  ? method.local_variables
                      .map((v) => `${v.name} (line ${v.line_number})`)
                      .join(", ")
                  : "None"}
              </div>

              <div className="mb-2">
                <strong>📞 Method Calls:</strong>{" "}
                {method.method_calls.length > 0
                  ? method.method_calls
                      .map((v) => `${v.name} (line ${v.line_number})`)
                      .join(", ")
                  : "None"}
              </div>

              <div className="mb-2">
                <strong>🔀 Conditionals:</strong>{" "}
                {method.conditionals.length > 0
                  ? method.conditionals
                      .map((c) => `${c.condition} (line ${c.line_number})`)
                      .join(", ")
                  : "None"}
              </div>
            </div>
          ))}
        </div>
      )}

      {result &&
        result.classes?.length === 0 &&
        result.top_level?.methods?.length === 0 && (
          <p className="mt-4 text-gray-400">No classes or methods found.</p>
        )}
    </div>
  );
}

export default App;
