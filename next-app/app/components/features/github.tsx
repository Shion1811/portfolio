"use client";
import { ghResponse } from "@/app/api/gh";
import { useState, useEffect } from "react";

export default function Github() {
  const [gh, setGh] = useState<ghResponse | null>(null);
  const links = (node: { name: string }) =>
    `https://github.com/${gh?.data.viewer.login}/${node.name}`;

  useEffect(() => {
    const fetchGh = async () => {
      const gh = await ghResponse();
      setGh(gh);
    };
    fetchGh();
  }, []);

  console.log(gh);
  return (
    <div className="flex flex-col my-4 w-full flex-wrap">
      <h1>Github</h1>
      {gh?.data.viewer.repositories.nodes.map((node) => (
        <div key={node.name}>
          <a href={links(node)}>{node.name}</a>
        </div>
      ))}
    </div>
  );
}
