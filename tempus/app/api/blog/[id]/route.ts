import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;

    // Get page details
    const page = await notion.pages.retrieve({ page_id: pageId });

    // Get page content (blocks)
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    const pageData: any = page;

    const post = {
      id: page.id,
      title: pageData.properties.Name?.title?.[0]?.plain_text || "Untitled",
      date: pageData.properties.Published?.date?.start || null,
      tags: pageData.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      cover: pageData.cover?.external?.url || pageData.cover?.file?.url || null,
      author: pageData.properties.Author?.rich_text?.[0]?.plain_text || null,
      content: blocks.results,
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
