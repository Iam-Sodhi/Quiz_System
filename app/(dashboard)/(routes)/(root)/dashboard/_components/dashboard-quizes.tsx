import React, { useState, useEffect } from "react";
import { Question, Quiz } from "@prisma/client"; // Assuming Quiz model from Prisma
import { InfoCard } from "./info-card";
import { CheckCircle, Clock } from "lucide-react";
import SkeletonLoader from "./skeleton-loader";
import { QuizList } from "./quiz-list"; 

type QuizWithProgress = Quiz & {
  progress: number | null; // Assuming progress field to indicate quiz completion
  teacherName: string;
  questions: Question[];
  isAttempted: boolean, // This field indicates if the quiz has been attempted
};

type DashboardQuizzes = {
  activeQuizzes: QuizWithProgress[];  // Active quizzes from followed teachers
  attemptedQuizzes: QuizWithProgress[]; // Past attempted quizzes
};

interface DashboardQuizzesCardProps {
  userId: string;
}

const DashboardQuizzesCard: React.FC<DashboardQuizzesCardProps> = ({ userId }) => {
  const [dashboardQuizzes, setDashboardQuizzes] = useState<DashboardQuizzes | null>(null);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchDashboardQuizzes = async () => {
      try {
        const response = await fetch(`/api/dashboardquizzes?userId=${userId}`);
        const data: DashboardQuizzes = await response.json();
        setDashboardQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch dashboard quizzes:", error);
      } finally {
        setLoading(false); // Turn off loading state when data is fetched
      }
    };

    fetchDashboardQuizzes();
  }, [userId]);

  if (loading || !dashboardQuizzes) {
    return <SkeletonLoader />; // Show skeleton loading component while waiting for data or if no data
  }

  const { activeQuizzes, attemptedQuizzes } = dashboardQuizzes;

  // Filter active quizzes to exclude the ones that have been attempted already
  const filteredActiveQuizzes = activeQuizzes.filter((quiz) => 
    !attemptedQuizzes.some((attempt) => attempt.id === quiz.id)
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Active Quizzes"
          numberOfItems={filteredActiveQuizzes.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Attempted"
          numberOfItems={attemptedQuizzes.length}
          variant="success"
        />
      </div>

      {/* Section for Active Quizzes */}
      {filteredActiveQuizzes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-normal pb-2">Active Quizzes</h2>
          <QuizList items={filteredActiveQuizzes} />
        </div>
      )}

      {/* Section for Attempted Quizzes */}
      {attemptedQuizzes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-normal pb-2">Attempted Quizzes</h2>
          <QuizList items={attemptedQuizzes} />
        </div>
      )}

      {/* Display message if no active or attempted quizzes */}
      {filteredActiveQuizzes.length === 0 && attemptedQuizzes.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No quizzes found
        </div>
      )}
    </div>
  );
};

export default DashboardQuizzesCard;
