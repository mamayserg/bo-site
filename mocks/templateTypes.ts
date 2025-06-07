export const mockTemplateTypes = [
  {
    id: 1,
    name: "Email Template",
    code: "email_tpl",
    segments: [],
      attributes: [
      {
        id: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Invoice Template",
    code: "invoice_tpl",
    segments: [{ id: 101 }],
    attributes: [
      {
        id: 101,
      },
    ],
  },
  {
    id: 3,
    name: "Report Template",
    code: "report_tpl",
    segments: [{ id: 2, name: "Consulting" }],
      attributes: [
      {
        id: 101,
      },
    ],
  },
];

export const attributes = [
      {
        id: 1,
        label: "Name",
        code: "name",
        type: "string",
        required: true,
        templateType: null,
      },
      {
        id: 2,
        label: "Description",
        code: "desc",
        type: "text",
        required: false,
        templateType: null,
      },
      {
        id: 3,
        label: "Status",
        code: "status",
        type: "enum",
        required: true,
        templateType: 2, // Already linked to another templateType
      },
      {
        id: 4,
        label: "Category",
        code: "category",
        type: "string",
        required: false,
        templateType: null,
      },
    ] 