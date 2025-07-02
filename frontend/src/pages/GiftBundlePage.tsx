import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiftBundle } from '../mockGiftGenius';

const GiftBundlePage: React.FC = () => {
  const location = useLocation();
  const bundle = (location.state as { bundle?: GiftBundle } | undefined)?.bundle;

  if (!bundle) {
    return <div className="p-4">No bundle selected.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{bundle.title}</h1>
      <ul className="space-y-2">
        {bundle.items.map((item) => (
          <li key={item.id} className="border p-3 rounded">
            <Link to={`/product/${item.id}`} className="font-semibold hover:underline">
              {item.title}
            </Link>
            <p className="text-sm">{item.description}</p>
            <p className="font-medium">Price: ${item.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Bundle Total: ${bundle.totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default GiftBundlePage;
