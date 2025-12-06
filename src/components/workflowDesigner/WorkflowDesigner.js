import React, { useState } from "react";
import WorkflowCanvas from "./WorkflowCanvas";
import NodeSidebar from "./NodeSidebar";
import SimulationPanel from "./SimulationPanel";
import { useActions } from "../../hooks/useActions";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";

function WorkflowDesigner() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const validationErrors = useWorkflowValidation(nodes, edges);

  const { actions, loading: actionsLoading } = useActions();

  const handleNodeChange = (updatedNode) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setSelectedNode(updatedNode);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) =>
      prev.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
    setSelectedNode(null);
  };

  const handleSave = async () => {
    console.log("Saving workflow (mock):", { nodes, edges });
    alert("Workflow saved (console only in this demo).");
  };

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <div
        style={{
          flex: 3,
          borderRight: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 8,
            borderBottom: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>HR Workflow Designer</h3>
            <button onClick={handleSave}>Save Workflow (Mock)</button>
          </div>

          <div style={{ fontSize: 12 }}>
            {validationErrors.length === 0 ? (
              <span style={{ color: "green" }}>No validation errors.</span>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, color: "red" }}>
                {validationErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onSelectNode={setSelectedNode}
          />
        </div>
      </div>

      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <NodeSidebar
          node={selectedNode}
          onChange={handleNodeChange}
          onDelete={handleDeleteNode}
          actions={actions}
          actionsLoading={actionsLoading}
        />
        <div style={{ borderTop: "1px solid #eee", height: "40%" }}>
          <SimulationPanel nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
}

export default WorkflowDesigner;
