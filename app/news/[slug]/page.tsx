"use client";
import React from "react";
import { useParams } from "next/navigation";
import PageBanner from "../../../components/PageBanner/PageBanner";
import NewsDetails from "../../../components/NewsPage/NewsDetails";

const Page = () => {
  const params = useParams();

  // Extract the ID from params (supports both string and object formats)
  const newsId =
    typeof params === "string"
      ? params
      : params?.slug || params?.id || (params as any)?.slug;

  // If still an object, get the first value
  const id = typeof newsId === "object" ? Object.values(newsId)[0] : newsId;

  if (!id) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center text-red-500">Invalid news ID</div>
      </div>
    );
  }

  return (
    <div>
      <NewsDetails newsId={id} />
    </div>
  );
};

export default Page;
