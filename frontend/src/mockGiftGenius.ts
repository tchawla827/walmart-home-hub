import { mockProducts } from './mockProducts';

export interface GiftBundle {
  title: string;
  items: string[];
  totalPrice: number;
}

export const mockGiftGenius = async (prompt: string): Promise<GiftBundle[]> => {
  console.log('mockGiftGenius called with prompt:', prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      const numBundles = 2 + Math.floor(Math.random() * 2); // 2-3 bundles
      const bundles: GiftBundle[] = [];
      for (let i = 0; i < numBundles; i++) {
        const numItems = 3 + Math.floor(Math.random() * 3); // 3-5 items
        const items: string[] = [];
        const chosenIndexes = new Set<number>();
        let total = 0;
        while (items.length < numItems) {
          const index = Math.floor(Math.random() * mockProducts.length);
          if (chosenIndexes.has(index)) continue;
          chosenIndexes.add(index);
          const prod = mockProducts[index];
          items.push(prod.title);
          total += prod.price;
        }
        bundles.push({
          title: `Bundle ${i + 1}`,
          items,
          totalPrice: parseFloat(total.toFixed(2)),
        });
      }
      resolve(bundles);
    }, 1000);
  });
};
