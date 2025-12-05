import React, { useState } from "react";
import { runSimulation } from "../../domain/simulation";

function SimulationPanel({ nodes, edges }) {
  const [contextJson, setContextJson] = useState('{"experienceYears": 3}');
  const [log, setLog] = useState([]);

  const onRun = () => {
    let context = {};
    try {
      context = JSON.parse(contextJson);
    } catch (e) {
      alert("Invalid JSON context");
      return;
    }

    const result = runSimulation(nodes, edges, context);
    const lines = result.steps.map(
      (s) => `[${s.nodeType.toUpperCase()}] ${s.message} (node: ${s.nodeId})`
    );
    setLog(lines);
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
        <h4>Simulation</h4>
        <label style={{ display: "block", marginBottom: 4 }}>
          <div>Test Context (JSON)</div>
          <textarea
            style={{ width: "100%", height: 60 }}
            value={contextJson}
            onChange={(e) => setContextJson(e.target.value)}
          />
        </label>
        <button onClick={onRun}>Run Workflow</button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 8,
          fontSize: 12,
        }}
      >
        {log.length === 0 ? (
          <div style={{ opacity: 0.6 }}>No simulation run yet.</div>
        ) : (
          log.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}

export default SimulationPanel;
