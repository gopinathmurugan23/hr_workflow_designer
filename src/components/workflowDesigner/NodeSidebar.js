import React from "react";

function NodeSidebar({ node, onChange, onDelete, actions = [] }) {
  if (!node) {
    return (
      <div style={{ padding: 16, height: "60%" }}>
        <h3>No node selected</h3>
        <p>Select a node to edit its configuration.</p>
      </div>
    );
  }

  const data = node.data || {};
  const type = data.type || node.type;
  const config = data.config || {};

  // Ensure default shapes
  const metadata = config.metadata || [];
  const customFields = config.customFields || [];
  const actionParams = config.actionParams || {};

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

  // ----- HELPERS FOR KEY-VALUE ARRAYS -----

  const updateKeyValueArray = (array, index, field, value, keyName) => {
    const copy = array.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateConfig({ [keyName]: copy });
  };

  const addKeyValueRow = (keyName) => {
    const current = config[keyName] || [];
    updateConfig({
      [keyName]: [...current, { key: "", value: "" }],
    });
  };

  const removeKeyValueRow = (keyName, index) => {
    const current = config[keyName] || [];
    const copy = current.filter((_, i) => i !== index);
    updateConfig({ [keyName]: copy });
  };

  // ---- AUTOMATED NODE ACTION PARAM HANDLING ----

  const selectedAction = actions.find((a) => a.id === config.actionId) || null;

  const handleActionChange = (actionId) => {
    const newAction = actions.find((a) => a.id === actionId) || null;

    let newParams = {};
    if (newAction) {
      newAction.params.forEach((p) => {
        newParams[p.name] =
          (config.actionParams && config.actionParams[p.name]) || "";
      });
    }

    updateConfig({
      actionId,
      actionParams: newParams,
    });
  };

  const handleActionParamChange = (paramName, value) => {
    updateConfig({
      actionParams: {
        ...actionParams,
        [paramName]: value,
      },
    });
  };

  return (
    <div style={{ padding: 16, overflowY: "auto", height: "60%" }}>
      <h3>Edit Node: {type ? type.toUpperCase() : node.type}</h3>

      {/* COMMON TITLE FIELD (Title / Start title / End message) */}
      <label style={{ display: "block", marginBottom: 8 }}>
        <div>
          {type === "start"
            ? "Start Title"
            : type === "end"
            ? "End Message"
            : "Title"}
        </div>
        <input
          style={{ width: "100%" }}
          value={config.name || ""}
          onChange={(e) => updateConfig({ name: e.target.value })}
        />
      </label>

      {/* SHARED DESCRIPTION */}
      {type !== "end" && (
        <label style={{ display: "block", marginBottom: 8 }}>
          <div>Description</div>
          <textarea
            style={{ width: "100%" }}
            rows={2}
            value={config.description || ""}
            onChange={(e) => updateConfig({ description: e.target.value })}
          />
        </label>
      )}

      {/* ===== START NODE FIELDS ===== */}
      {type === "start" && (
        <>
          <div style={{ marginTop: 8, marginBottom: 4, fontWeight: 600 }}>
            Metadata (optional key-value)
          </div>
          {metadata.length === 0 && (
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
              No metadata yet. Add a row.
            </div>
          )}

          {metadata.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: 4, marginBottom: 4 }}
            >
              <input
                placeholder="Key"
                style={{ flex: 1 }}
                value={item.key || ""}
                onChange={(e) =>
                  updateKeyValueArray(
                    metadata,
                    index,
                    "key",
                    e.target.value,
                    "metadata"
                  )
                }
              />
              <input
                placeholder="Value"
                style={{ flex: 1 }}
                value={item.value || ""}
                onChange={(e) =>
                  updateKeyValueArray(
                    metadata,
                    index,
                    "value",
                    e.target.value,
                    "metadata"
                  )
                }
              />
              <button
                type="button"
                onClick={() => removeKeyValueRow("metadata", index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addKeyValueRow("metadata")}
            style={{ marginTop: 4 }}
          >
            + Add Metadata
          </button>
        </>
      )}

      {/* ===== TASK NODE FIELDS ===== */}
      {type === "task" && (
        <>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Assignee</div>
            <input
              style={{ width: "100%" }}
              value={config.assignee || ""}
              onChange={(e) => updateConfig({ assignee: e.target.value })}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Due Date</div>
            {/* You can switch to type="date" if you like */}
            <input
              style={{ width: "100%" }}
              type="text"
              placeholder="YYYY-MM-DD or any text"
              value={config.dueDate || ""}
              onChange={(e) => updateConfig({ dueDate: e.target.value })}
            />
          </label>

          <div style={{ marginTop: 8, marginBottom: 4, fontWeight: 600 }}>
            Custom Fields (optional key-value)
          </div>

          {customFields.length === 0 && (
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
              No custom fields. Add one if needed.
            </div>
          )}

          {customFields.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: 4, marginBottom: 4 }}
            >
              <input
                placeholder="Field Key"
                style={{ flex: 1 }}
                value={item.key || ""}
                onChange={(e) =>
                  updateKeyValueArray(
                    customFields,
                    index,
                    "key",
                    e.target.value,
                    "customFields"
                  )
                }
              />
              <input
                placeholder="Field Value"
                style={{ flex: 1 }}
                value={item.value || ""}
                onChange={(e) =>
                  updateKeyValueArray(
                    customFields,
                    index,
                    "value",
                    e.target.value,
                    "customFields"
                  )
                }
              />
              <button
                type="button"
                onClick={() => removeKeyValueRow("customFields", index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addKeyValueRow("customFields")}
            style={{ marginTop: 4 }}
          >
            + Add Custom Field
          </button>
        </>
      )}

      {/* ===== APPROVAL NODE FIELDS ===== */}
      {type === "approval" && (
        <>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Approver Role</div>
            <input
              style={{ width: "100%" }}
              placeholder="Manager, HRBP, Director, etc."
              value={config.approverRole || ""}
              onChange={(e) => updateConfig({ approverRole: e.target.value })}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Auto-approve Threshold (number)</div>
            <input
              style={{ width: "100%" }}
              type="number"
              value={
                config.autoApproveThreshold !== undefined
                  ? config.autoApproveThreshold
                  : ""
              }
              onChange={(e) =>
                updateConfig({
                  autoApproveThreshold:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </label>
        </>
      )}

      {/* ===== AUTOMATED STEP NODE FIELDS ===== */}
      {type === "automated" && (
        <>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Action</div>
            <select
              style={{ width: "100%" }}
              value={config.actionId || ""}
              onChange={(e) => handleActionChange(e.target.value)}
            >
              <option value="">Select an action</option>
              {actions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          {selectedAction && (
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  marginBottom: 4,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Action Parameters
              </div>

              {selectedAction.params.map((p) => (
                <label
                  key={p.name}
                  style={{ display: "block", marginBottom: 8 }}
                >
                  <div>{p.label}</div>
                  {p.type === "text" ? (
                    <textarea
                      style={{ width: "100%" }}
                      rows={3}
                      value={actionParams[p.name] || ""}
                      onChange={(e) =>
                        handleActionParamChange(p.name, e.target.value)
                      }
                    />
                  ) : (
                    <input
                      style={{ width: "100%" }}
                      value={actionParams[p.name] || ""}
                      onChange={(e) =>
                        handleActionParamChange(p.name, e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== END NODE FIELDS ===== */}
      {type === "end" && (
        <>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 8,
              marginBottom: 8,
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={!!config.summaryFlag}
              onChange={(e) => updateConfig({ summaryFlag: e.target.checked })}
            />
            <span>Show summary when workflow completes</span>
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
