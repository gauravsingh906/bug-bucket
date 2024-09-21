// QuestionForm.tsx
import React, { useState } from "react";
import { databases, storage } from "@/models/server/config"; // adjust as necessary
import { questionCollection, db, questionAttachmentBucket } from "@/models/name";
import { useAuthStore } from "@/store/Auth"; // Assuming you have a user context
import slugify from "@/utils/slugify";
import { useRouter } from "next/navigation";
import { ID } from "node-appwrite"; // To generate unique IDs for files

const QuestionForm = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null); // State to handle file upload
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Title and content are required.");
            return;
        }

        let attachmentId = null;

        if (attachment) {
            try {
                const uploadResponse = await storage.createFile(
                    questionAttachmentBucket,
                    ID.unique(),
                    attachment
                );
                attachmentId = uploadResponse.$id; // Save attachment ID
            } catch (err) {
                setError("Failed to upload the attachment. Please try again.");
                console.error(err);
                return;
            }
        }
        console.log(attachmentId)

        const questionData = {
            title,
            content,
            authorId: user?.$id,
            tags: tags.split(",").map(tag => tag.trim()), // Split tags into an array
            attachmentId, // Include attachment ID in the question data
        };
        console.log(questionData)

        try {
            const response = await databases.createDocument(db, questionCollection, ID.unique(), questionData);
            router.push(`/questions/${response.$id}/${slugify(title)}`);
        } catch (err) {
            setError("Failed to submit your question. Please try again.");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="tags" className="block text-sm font-medium">Tags (comma separated)</label>
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label htmlFor="attachment" className="block text-sm font-medium">Attachment (optional)</label>
                <input
                    type="file"
                    id="attachment"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Ask Question</button>
        </form>
    );
};

export default QuestionForm;
