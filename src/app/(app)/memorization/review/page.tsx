// src/app/(app)/memorization/review/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Brain,
  Loader2,
} from "lucide-react";
import { useMemorizationStore } from "@/stores/memorizationStore";
import PageReviewCard from "@/components/memorization/PageReviewCard";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const specificPage = searchParams.get("page");

  const { getDueReviews, getLearningQueue, getPage } = useMemorizationStore();

  const [queue, setQueue] = useState(() => {
    if (specificPage) {
      const page = getPage(Number(specificPage));
      return page ? [page] : [];
    }
    const due = getDueReviews();
    const learning = getLearningQueue().slice(0, 3);
    return [...due, ...learning];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const currentPage = queue[currentIndex];
  const isComplete = currentIndex >= queue.length;

  const handleNext = () => {
    if (currentPage) {
      setCompleted((c) => [...c, currentPage.id]);
    }
    setCurrentIndex((i) => i + 1);
  };

  if (queue.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 text-center">
        <Brain className="w-16 h-16 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-100 mb-2">
          Nothing to review
        </h2>
        <p className="text-sm text-surface-400 mb-6">
          You're all caught up! Add more pages or come back later.
        </p>
        <Link href="/memorization">
          <button className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all">
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 md:px-6 py-16 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-glow">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-surface-50 mb-2">
          Session Complete!
        </h2>
        <p className="text-sm text-surface-400 mb-2">
          You reviewed {completed.length} page
          {completed.length !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-surface-500 mb-8">
          Consistency is key. Come back tomorrow!
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/memorization">
            <button className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/memorization"
          className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-300 transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Exit session
        </Link>
        <div className="text-xs text-surface-400">
          <span className="font-bold text-primary-400">
            {currentIndex + 1}
          </span>{" "}
          / {queue.length}
        </div>
      </div>

      <div className="h-1 bg-surface-800 rounded-full overflow-hidden mb-8">
        <motion.div
          animate={{
            width: `${(currentIndex / queue.length) * 100}%`,
          }}
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
        />
      </div>

      <PageReviewCard
        key={currentPage.id}
        memorizedPage={currentPage}
        onComplete={handleNext}
      />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  );
}