import React from "react";

interface StepLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
}

export const StepLayout: React.FC<StepLayoutProps> = ({
  children,
  imageUrl = "https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Content */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="px-8 w-full">{children}</div>
      </div>

      {/* Right side - Image */}
      <div
        className="w-1/2 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  );
};
