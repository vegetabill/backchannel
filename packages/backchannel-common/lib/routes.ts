const WS_REGEX = /^\/c\/([\w_-]+)$/;

export const apiRoutes = {
  CHANNELS_RESOURCE: {
    indexPath: "/channels",
  },
  CHANNEL_WEBSOCKET: {
    matcher: (path: string): string | null => {
      const m = WS_REGEX.exec(path);
      if (m && m.length > 0) {
        return m[1];
      }
      return null;
    },
    build: (channelId: string) => `/c/${channelId}`,
  },
};
