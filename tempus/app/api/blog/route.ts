import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      sorts: [
        {
          property: "Published",
          direction: "descending",
        },
      ],
    });

    const posts = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Untitled",
      date: page.properties.Published?.date?.start || null,
      tags: page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      cover:
        page.cover?.external?.url ||
        page.cover?.file?.url ||
        null,
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
