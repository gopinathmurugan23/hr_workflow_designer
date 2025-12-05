import React from "react";
import { Handle, Position } from "reactflow";

function TaskNode({ data }) {
  const config = (data && data.config) || {};
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        border: "1px solid #999",
        background: "#fff",
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>Task</div>
      <div style={{ fontSize: 14 }}>{config.name || "Untitled task"}</div>
      {config.assigneeRole && (
        <div style={{ fontSize: 10, opacity: 0.7 }}>
          Assignee: {config.assigneeRole}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TaskNode;
