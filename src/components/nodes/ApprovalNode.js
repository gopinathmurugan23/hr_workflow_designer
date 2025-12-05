import React from "react";
import { Handle, Position } from "reactflow";

function ApprovalNode({ data }) {
  const config = (data && data.config) || {};
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        border: "1px solid #0052cc",
        background: "#e6f0ff",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>Approval</div>
      <div style={{ fontSize: 14 }}>{config.name || "Approval step"}</div>
      {config.approverRole && (
        <div style={{ fontSize: 10, opacity: 0.7 }}>
          Approver: {config.approverRole}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ApprovalNode;
