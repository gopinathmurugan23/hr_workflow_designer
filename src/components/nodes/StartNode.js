import React from "react";
import { Handle, Position } from "reactflow";

function StartNode({ data }) {
  const config = (data && data.config) || {};
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 999,
        border: "2px solid green",
        background: "#e9fbe9",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>Start</div>
      <div style={{ fontSize: 12 }}>{config.name || "Start"}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default StartNode;
