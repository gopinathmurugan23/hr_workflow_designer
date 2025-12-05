import React from "react";

function NodeSidebar({ node, onChange, onDelete }) {
  if (!node) {
    return (
      <div style={{ padding: 16, height: "60%" }}>
        <h3>No node selected</h3>
        <p>Select a node to edit its configuration.</p>
      </div>
    );
  }

  const data = node.data || {};
  const config = data.config || {};
  const type = data.type || node.type;

  const updateConfig = (partial) => {
    const updated = {
      ...node,
      data: {
        ...node.data,
        config: {
          ...config,
          ...partial,
        },
      },
    };
    onChange(updated);
  };

  return (
    <div style={{ padding: 16, overflowY: "auto", height: "60%" }}>
      <h3>Edit Node: {type ? type.toUpperCase() : node.type}</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        <div>Name</div>
        <input
          style={{ width: "100%" }}
          value={config.name || ""}
          onChange={(e) => updateConfig({ name: e.target.value })}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <div>Description</div>
        <textarea
          style={{ width: "100%" }}
          rows={2}
          value={config.description || ""}
          onChange={(e) => updateConfig({ description: e.target.value })}
        />
      </label>

      {type === "task" && (
        <>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Assignee Role</div>
            <input
              style={{ width: "100%" }}
              value={config.assigneeRole || ""}
              onChange={(e) => updateConfig({ assigneeRole: e.target.value })}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div>API Endpoint (mock)</div>
            <input
              style={{ width: "100%" }}
              value={config.apiEndpoint || ""}
              onChange={(e) => updateConfig({ apiEndpoint: e.target.value })}
            />
          </label>
        </>
      )}

      {type === "approval" && (
        <label style={{ display: "block", marginBottom: 8 }}>
          <div>Approver Role</div>
          <input
            style={{ width: "100%" }}
            value={config.approverRole || ""}
            onChange={(e) => updateConfig({ approverRole: e.target.value })}
          />
        </label>
      )}

      {type === "automated" && (
        <>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Action Type</div>
            <input
              style={{ width: "100%" }}
              value={config.actionType || ""}
              onChange={(e) => updateConfig({ actionType: e.target.value })}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div>API Endpoint (mock)</div>
            <input
              style={{ width: "100%" }}
              value={config.apiEndpoint || ""}
              onChange={(e) => updateConfig({ apiEndpoint: e.target.value })}
            />
          </label>
        </>
      )}

      <button
        onClick={() => onDelete(node.id)}
        style={{
          marginTop: 12,
          backgroundColor: "#ffdddd",
          border: "1px solid #ff8888",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        Delete Node
      </button>
    </div>
  );
}

export default NodeSidebar;
