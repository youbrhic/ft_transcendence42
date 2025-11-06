export const friend_request = {
  type: "object",
  required: ["frined_username"],
  properties: {
    frined_username: { type: "string" },
  },
  additionalProperties: false,
};

export const delete_req = {
  type: "object",
  required: ["frined_username", "type"],
  properties: {
    frined_username: { type: "string" },
    type: { type: "string", enum: ["send", "receiv"] },
  },
  additionalProperties: false,
};

export const delete_friend = {
  type: "object",
  required: ["frined_username"],
  properties: {
    frined_username: { type: "string" },
  },
  additionalProperties: false,
};
