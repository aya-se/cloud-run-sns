import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAuth } from "google-auth-library";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_URL = process.env.API_URL;
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(API_URL ?? "");
  const response = await client
    .request({
      url: `${API_URL}/posts`,
      method: req.method as "GET" | "POST" | "DELETE",
      headers: req.headers,
      data: req.body,
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
  const data = await response;
  res.status(200).json(data);
}
