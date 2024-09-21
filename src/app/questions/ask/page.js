// pages/questions/ask.tsx
"use client";

import React from "react";
import QuestionForm from "@/components/QuestionForm";

const AskQuestionPage = () => {
    return (
        <div className="container mx-auto px-4 pt-32">
            <h1 className="mb-10 text-2xl">Ask a Question</h1>
            <QuestionForm />
        </div>
    );
};

export default AskQuestionPage;
