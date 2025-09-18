import CreateSignatureForm from "@/components/SignatureForm";
import React from "react";

const Signatures = () => {
  return (
    <div className="w-full h-full overflow-y-auto flex items-center justify-center">
      <div className="max-w-[1124px] w-full m-10">
        <CreateSignatureForm />
        {/* <div className="col-span-2 bg-black"></div>
        <div className="col-span-4 bg-black"></div> */}
      </div>
    </div>
  );
};

export default Signatures;
