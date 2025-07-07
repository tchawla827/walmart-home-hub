import { mockProducts, Product } from "./mockProducts";

export interface GiftBundle {
  title: string;
  items: Product[];
  totalPrice: number;
  /** Percentage discount applied to the bundle */
  discountPercent: number;
}

export interface GiftSuggestions {
  bundles: GiftBundle[];
  items: Product[];
}

export const mockGiftGenius = async (
  prompt: string,
): Promise<GiftSuggestions> => {
  console.log("mockGiftGenius called with prompt:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      const numBundles = 2 + Math.floor(Math.random() * 2); // 2-3 bundles
      const bundles: GiftBundle[] = [];
      for (let i = 0; i < numBundles; i++) {
        const numItems = 3 + Math.floor(Math.random() * 3); // 3-5 items
        const items: Product[] = [];
        const chosenIndexes = new Set<number>();
        let total = 0;
        while (items.length < numItems) {
          const index = Math.floor(Math.random() * mockProducts.length);
          if (chosenIndexes.has(index)) continue;
          chosenIndexes.add(index);
          const prod = mockProducts[index];
          items.push(prod);
          total += prod.price;
        }
        const discountPercent = 10 + Math.floor(Math.random() * 11); // 10-20%
        const discountedTotal = parseFloat(
          (total * (1 - discountPercent / 100)).toFixed(2),
        );
        bundles.push({
          title: `Bundle ${i + 1}`,
          items,
          totalPrice: discountedTotal,
          discountPercent,
        });
      }

      // Generate solo item recommendations
      const numSolo = 2 + Math.floor(Math.random() * 3); // 2-4 items
      const soloItems: Product[] = [];
      const chosenSoloIndexes = new Set<number>();
      while (soloItems.length < numSolo) {
        const index = Math.floor(Math.random() * mockProducts.length);
        if (chosenSoloIndexes.has(index)) continue;
        chosenSoloIndexes.add(index);
        soloItems.push(mockProducts[index]);
      }

      resolve({ bundles, items: soloItems });
    }, 1000);
  });
};
