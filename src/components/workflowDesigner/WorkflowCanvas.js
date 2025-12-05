import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import ApprovalNode from "../nodes/ApprovalNode";
import ConditionNode from "../nodes/ConditionNode";
import EndNode from "../nodes/EndNode";
import StartNode from "../nodes/startNode";
import TaskNode from "../nodes/taskNode";

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  condition: ConditionNode,
  end: EndNode,
};

function WorkflowCanvas({ nodes, edges, setNodes, setEdges, onSelectNode }) {
  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      // sync external
      setNodes((prev) => {
        return [...flowNodes];
      });
    },
    [onNodesChange, setNodes, flowNodes]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      setEdges((prev) => {
        return [...flowEdges];
      });
    },
    [onEdgesChange, setEdges, flowEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      const newEdges = addEdge(connection, flowEdges);
      setEdges(newEdges);
    },
    [flowEdges, setEdges]
  );

  const handleNodeClick = (_, node) => {
    onSelectNode(node);
  };

  // Quick buttons to add nodes
  const addTaskNode = () => {
    const id = `task_${nodes.length + 1}`;
    const newNode = {
      id,
      type: "task",
      position: { x: 100 + nodes.length * 40, y: 100 },
      data: {
        type: "task",
        config: {
          name: `Task ${nodes.length + 1}`,
          description: "",
          assigneeRole: "",
          apiEndpoint: "",
        },
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const addStartNode = () => {
    const id = `start_${Date.now()}`;
    const newNode = {
      id,
      type: "start",
      position: { x: 50, y: 50 },
      data: {
        type: "start",
        config: {
          name: "Start",
          description: "",
        },
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const addEndNode = () => {
    const id = `end_${Date.now()}`;
    const newNode = {
      id,
      type: "end",
      position: { x: 400, y: 200 },
      data: {
        type: "end",
        config: {
          name: "End",
          description: "",
        },
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const addApprovalNode = () => {
    const id = `approval_${Date.now()}`;
    const newNode = {
      id,
      type: "approval",
      position: { x: 250, y: 150 },
      data: {
        type: "approval",
        config: {
          name: "Approval",
          description: "",
          approverRole: "",
        },
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const addConditionNode = () => {
    const id = `condition_${Date.now()}`;
    const newNode = {
      id,
      type: "condition",
      position: { x: 250, y: 250 },
      data: {
        type: "condition",
        config: {
          name: "Condition",
          description: "",
          branches: [],
        },
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
        <button onClick={addStartNode} style={{ marginRight: 8 }}>
          + Start
        </button>
        <button onClick={addTaskNode} style={{ marginRight: 8 }}>
          + Task
        </button>
        <button onClick={addApprovalNode} style={{ marginRight: 8 }}>
          + Approval
        </button>
        <button onClick={addConditionNode} style={{ marginRight: 8 }}>
          + Condition
        </button>
        <button onClick={addEndNode}>+ End</button>
      </div>

      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default WorkflowCanvas;
