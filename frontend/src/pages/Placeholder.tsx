import React from 'react';

interface Props {
  title: string;
}

const Placeholder: React.FC<Props> = ({ title }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4">This page is under construction.</p>
  </div>
);

export default Placeholder;
