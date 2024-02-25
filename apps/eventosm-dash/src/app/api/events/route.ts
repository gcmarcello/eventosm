import * as service from "./service";

export async function GET(request) {
  const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const eventGroups = await service.readEventGroups(request);

  const data = await res.json();

  return Response.json({ data });
}
