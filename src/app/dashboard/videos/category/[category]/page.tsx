import VideoCategoryClient from "./VideoCategoryClient";

interface PageProps {
  params: {
    category: string;
  };
}

export default function Page({ params }: PageProps) {
  // server component: decode the category param in case it was encoded in the URL
  let category = params.category || "";
  try {
    category = decodeURIComponent(category);
  } catch (e) {
    // if decode fails just use the original
  }

  return <VideoCategoryClient category={category} />;
}
