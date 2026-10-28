let requests = [];

export function addRequest(data) {
  requests.push({
    id: Date.now(),
    ...data,
    createdAt: new Date(),
  });
}

export function getRequests() {
  return requests;
}