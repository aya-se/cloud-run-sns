import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_URL = process.env.API_URL;
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: req.body,
  });
  const data = await response.json();
  res.status(200).json(data);
}