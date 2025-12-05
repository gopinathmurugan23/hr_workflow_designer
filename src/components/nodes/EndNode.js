import React from "react";
import { Handle, Position } from "reactflow";

function EndNode({ data }) {
  const config = (data && data.config) || {};
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 999,
        border: "2px solid red",
        background: "#ffe9e9",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>End</div>
      <div style={{ fontSize: 12 }}>{config.name || "End"}</div>
      <Handle type="target" position={Position.Top} />
    </div>
  );
}

export default EndNode;
