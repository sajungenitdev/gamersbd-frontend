import React from "react";
// import PageBanner from "../../components/PageBanner/PageBanner";
import FAQPage from "../../components/FAQPage/FAQPage";

const page = () => {
  return (
    <div>
      {/* <PageBanner
        title="FAQ"
        breadcrumbs={[
          { label: "Frequently asked question", href: "/track-order" },
        ]}
      /> */}
      <FAQPage />
    </div>
  );
};

export default page;
