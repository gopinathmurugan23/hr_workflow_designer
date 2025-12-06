const MOCK_ACTIONS = [
  {
    id: "send_email",
    label: "Send Email",
    params: [
      { name: "to", label: "To (email)", type: "string" },
      { name: "subject", label: "Subject", type: "string" },
      { name: "body", label: "Body", type: "text" },
    ],
  },
  {
    id: "generate_pdf",
    label: "Generate PDF",
    params: [
      { name: "templateId", label: "Template ID", type: "string" },
      { name: "outputName", label: "Output File Name", type: "string" },
    ],
  },
  {
    id: "post_webhook",
    label: "POST Webhook",
    params: [
      { name: "url", label: "URL", type: "string" },
      { name: "payloadJson", label: "Payload (JSON)", type: "text" },
    ],
  },
];

export function getActions() {
  // Simulate async mock API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ACTIONS);
    }, 300);
  });
}
