import React, { useState } from "react";
import { simulateWorkflow } from "../../api/simulate";

function SimulationPanel({ nodes, edges }) {
  const [contextJson, setContextJson] = useState(`{
    "employeeName": "Alice",
    "employeeEmail": "alice@example.com",
    "experienceYears": 4,
    "department": "Engineering"
  }`);
  const [log, setLog] = useState([]);
  const [errors, setErrors] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    let context = {};
    try {
      context = JSON.parse(contextJson || "{}");
    } catch (e) {
      alert("Invalid JSON context");
      return;
    }

    setLoading(true);
    setErrors([]);
    setLog([]);
    setCompleted(false);

    const payload = {
      nodes,
      edges,
      context,
    };

    const result = await simulateWorkflow(payload);
    setLoading(false);

    if (result.structureErrors && result.structureErrors.length > 0) {
      setErrors(result.structureErrors);
      setLog([]);
      setCompleted(false);
      return;
    }

    const lines =
      result.steps?.map(
        (s, index) =>
          `${index + 1}. [${s.nodeType.toUpperCase()}] ${s.message} (node: ${
            s.nodeId
          })`
      ) || [];

    setLog(lines);
    setCompleted(!!result.completed);
  };

  return (
    <div
      style={{
        padding: 8,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <h4 style={{ margin: "0 0 4px 0" }}>Workflow Sandbox</h4>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
          Runs the current workflow via a mock /simulate API and shows a
          step-by-step log.
        </p>

        <label style={{ display: "block", marginTop: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 12 }}>Test Context (JSON)</div>
          <textarea
            style={{ width: "100%", height: 60, fontSize: 12 }}
            value={contextJson}
            onChange={(e) => setContextJson(e.target.value)}
          />
        </label>

        <button onClick={onRun} disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Simulating..." : "Run Simulation"}
        </button>
      </div>

      {errors.length > 0 && (
        <div
          style={{
            border: "1px solid #ffb3b3",
            background: "#ffecec",
            padding: 6,
            marginBottom: 6,
            fontSize: 12,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Cannot simulate – fix these structural issues:
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 8,
          fontSize: 12,
          background: "#fafafa",
        }}
      >
        {log.length === 0 && errors.length === 0 && !loading && (
          <div style={{ opacity: 0.6 }}>
            No simulation run yet. Build a workflow and click{" "}
            <strong>Run Simulation</strong>.
          </div>
        )}

        {log.length > 0 && (
          <>
            <div style={{ marginBottom: 6 }}>
              <strong>Execution Log</strong>{" "}
              {completed ? (
                <span style={{ color: "green" }}>(Completed)</span>
              ) : (
                <span style={{ color: "#aa8800" }}>(Stopped early)</span>
              )}
            </div>
            {log.map((line, i) => (
              <div key={i} style={{ marginBottom: 2 }}>
                {line}
              </div>
            ))}
          </>
        )}

        {loading && (
          <div style={{ opacity: 0.6 }}>Running workflow simulation...</div>
        )}
      </div>
    </div>
  );
}

export default SimulationPanel;
