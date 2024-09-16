import React from "react";

const TitlePage: React.FC<{
  text: string;
}> = ({ text }) => {
  return <h1 className="text-2xl font-bold md:text-4xl">{text}</h1>;
};

export default TitlePage;
