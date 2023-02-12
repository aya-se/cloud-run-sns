import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query);
  const API_URL = process.env.API_URL;
  const query = new URLSearchParams(req.query as Record<string, string>);
  const response = await fetch(`${API_URL}/post?${query}`, {
    method: "POST",
  });
  const data = await response.json();
  res.status(200).json(data);
}