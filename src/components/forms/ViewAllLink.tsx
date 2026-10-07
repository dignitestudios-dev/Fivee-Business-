import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

const ViewAllLink = ({ href }: { href: string }) => (
  <div className="flex justify-end pt-3">
    <Link href={href} className="text-[var(--primary)] cursor-pointer group">
      View all{" "}
      <GoArrowRight size={18} className="mb-1 ms-1 inline move-x" />
    </Link>
  </div>
);

export default ViewAllLink;
