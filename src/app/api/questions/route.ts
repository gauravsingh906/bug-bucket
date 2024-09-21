// route.ts
import { NextResponse } from "next/server";
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Permission } from "node-appwrite";
import { Query } from "appwrite";

export async function POST(request: Request) {
    const body = await request.json();
    const { title, content, authorId, tags } = body;

    if (!title || !content || !authorId) {
        return NextResponse.json({ error: "Title, content, and authorId are required." }, { status: 400 });
    }

    const questionData = {
        title,
        content,
        authorId,
        tags: tags.split(",").map((tag: any) => tag.trim()),
    };

    try {
        const response = await databases.createDocument(db, questionCollection, "unique()", questionData);
        return NextResponse.json({ message: "Question created successfully.", questionId: response.$id }, { status: 201 });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const queries = [
        // Set your default queries here
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (tag) {
        queries.push(Query.equal("tags", tag));
    }

    if (search) {
        queries.push(Query.or([
            Query.search("title", search),
            Query.search("content", search),
        ]));
    }

    try {
        const questions = await databases.listDocuments(db, questionCollection, queries);
        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
    }
}
