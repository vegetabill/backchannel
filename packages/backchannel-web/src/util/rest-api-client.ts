const REST_API_ENDPOINT =
  process.env.REACT_REST_API_ENDPOINT || "http://localhost:3001";

const defaultOptions = {};
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function buildRemotePath(relativePath: string) {
  return `${REST_API_ENDPOINT}/${relativePath}`;
}

function jsonResponseHandler(resp: Response) {
  if (resp.ok) {
    return resp.text().then((txt) => {
      if (txt.length === 0) {
        return null;
      } else {
        return JSON.parse(txt);
      }
    });
  } else {
    throw new Error(
      `Unexpected server response: ${resp.status} ${resp.statusText}`
    );
  }
}

function request(
  path: string,
  fetchOptions?: Record<string, string>,
  headers?: Record<string, string>
) {
  const mergedOptions = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };
  return fetch(buildRemotePath(path), mergedOptions).then(jsonResponseHandler);
}

export function createChannel() {
  return request("channels", { method: "POST" });
}
