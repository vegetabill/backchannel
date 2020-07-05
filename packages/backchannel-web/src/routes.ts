export default {
  ROOT: {
    pattern: "/",
    build: () => "/",
  },
  CREATE_CHANNEL: {
    pattern: "/channels/create",
    build: () => "/channels/create",
  },
  JOIN_CHANNEL: {
    pattern: "/channels/:channelId",
    build: (channelId: string) => `/channels/${channelId}`,
  },
};
