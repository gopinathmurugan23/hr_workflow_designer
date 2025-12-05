import React from "react";
import { Handle, Position } from "reactflow";

function ConditionNode({ data }) {
  const config = (data && data.config) || {};
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        border: "1px dashed #ff9800",
        background: "#fff7e6",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>Condition</div>
      <div style={{ fontSize: 14 }}>{config.name || "Condition"}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ConditionNode;
