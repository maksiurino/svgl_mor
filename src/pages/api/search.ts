import db from "data/svgs.json";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, q, c } = req.query;

  // 🔎 Search by id (ex: ?id=1) ->
  if (id) {
    const item = db.find((item) => item.id === +id);
    return res.status(200).json(item);
  }

  // 🔎 Search by query (ex: ?q=d) ->
  if (q) {
    const results = db.filter((product) => {
      const { title } = product;
      const words = q.match(/[^ ]+/g);

      const titleMatch = words.every((word: string) => {
        return title.toLowerCase().includes(word.toLowerCase());
      });

      return titleMatch;
    });
    return res.status(200).json(results);
  }

  // 🔎 Search by category (ex: ?c=library) ->
  if (c) {
    const results = db.filter((product) => {
      const { category } = product;
      return category.toLowerCase().includes(c.toString().toLowerCase());
    });
    return res.status(200).json(results);
  }

  // ✖ Error ->
  res.status(400).json({ info: "[/api/search] Error: api query not found." });
}
