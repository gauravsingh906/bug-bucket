import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import NumberTicker from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { FaStar, FaQuestionCircle, FaComments } from "react-icons/fa";

const Page = async ({ params }: { params: { userId: string; userSlug: string } }) => {
    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(params.userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", params.userId),
            Query.limit(1),
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", params.userId),
            Query.limit(1),
        ]),
    ]);

    return (
        <MagicContainer className="flex flex-col items-center gap-6 p-6 md:flex-row md:gap-10 bg-black">
            {/* Reputation Card */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
                <MagicCard className="relative flex flex-col items-center justify-center h-48 p-6 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                    <div className="relative z-10 flex items-center">
                        <FaStar className="text-white text-2xl" />
                        <h2 className="ml-2 text-lg font-bold text-white">Reputation</h2>
                    </div>
                    <p className="relative z-10 text-4xl font-semibold text-white">
                        <NumberTicker value={user.prefs.reputation} />
                    </p>
                </MagicCard>
            </div>

            {/* Questions Asked Card */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
                <MagicCard className="relative flex flex-col items-center justify-center h-48 p-6 bg-gradient-to-br from-green-500 to-green-700 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                    <div className="relative z-10 flex items-center">
                        <FaQuestionCircle className="text-white text-2xl" />
                        <h2 className="ml-2 text-lg font-bold text-white">Questions Asked</h2>
                    </div>
                    <p className="relative z-10 text-4xl font-semibold text-white">
                        <NumberTicker value={questions.total} />
                    </p>
                </MagicCard>
            </div>

            {/* Answers Given Card */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
                <MagicCard className="relative flex flex-col items-center justify-center h-48 p-6 bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                    <div className="relative z-10 flex items-center">
                        <FaComments className="text-white text-2xl" />
                        <h2 className="ml-2 text-lg font-bold text-white">Answers Given</h2>
                    </div>
                    <p className="relative z-10 text-4xl font-semibold text-white">
                        <NumberTicker value={answers.total} />
                    </p>
                </MagicCard>
            </div>
        </MagicContainer>


    );
};

export default Page;
