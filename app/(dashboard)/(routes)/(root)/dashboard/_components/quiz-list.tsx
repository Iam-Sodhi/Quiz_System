"use client";

import React from "react";
import { Quiz } from "@prisma/client";
import { QuizCard } from "@/components/quiz-card";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuizWithProgress extends Quiz {
  progress: number | null;
  teacherName: string
}

interface QuizListProps {
  items: QuizWithProgress[];
}

export const QuizList: React.FC<QuizListProps> = ({ items }) => {
  const path = usePathname();
  const isCollectionPage = path.includes("collection");
  const isInstructorPage = path.includes("instructors");
  console.log("Items passed to Quiz cards: ",items)

  return (
    <>
      <div
        className={cn(
          "grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4",
          isCollectionPage || isInstructorPage ? "md:grid-cols-3 lg:grid-cols-4" : ""
        )}
      >
        {items.map((item) => (
          <QuizCard
            key={item.id}
            id={item.id}
            title={item.title}
            teacherName={item.teacherName}
            description={item.description ?? undefined}  // Ensure `description` is `undefined` if `null`
            isActive={item.isActive}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No quizzes found
        </div>
      )}
    </>
  );
};