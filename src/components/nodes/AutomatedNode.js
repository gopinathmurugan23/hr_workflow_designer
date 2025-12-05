import React from "react";
import { Handle, Position } from "reactflow";

function AutomatedNode({ data }) {
  const config = (data && data.config) || {};

  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        border: "1px solid #9c27b0",
        background: "#fbe9ff",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>Automated Step</div>
      <div style={{ fontSize: 14 }}>{config.name || "Automated action"}</div>
      {config.actionType && (
        <div style={{ fontSize: 10, opacity: 0.7 }}>
          Action: {config.actionType}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default AutomatedNode;
