import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_URL = process.env.API_URL;
  if (req.method === "POST") {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: req.headers.authorization || "",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(200).json(data);
  }
  if (req.method === "DELETE") {
    if (!req.query.id) return;
    const response = await fetch(`${API_URL}/posts`, {
      method: "DELETE",
      headers: {
        Authorization: req.headers.authorization || "",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(200).json(data);
  }
}
