import React from "react";

const Links = () => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="mb-8 bg-[#2a8636] p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-white font-['Luckiest_Guy']">
          Links
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for links content */}
        <div className="p-6 bg-white rounded-xl shadow-custom hover:shadow-elevated transition-shadow">
          <h2 className="mb-4 text-xl font-semibold">Important Links</h2>
          <p className="text-gray-600">Add your important links here.</p>
        </div>
      </div>
    </div>
  );
};

export default Links;