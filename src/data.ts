export interface SkincareIngredient {
  name: string;
  benefits: string[];
  description: string;
  tags: string[]; // e.g. "hydrate", "acne", "anti-aging"
}

export interface SkincareProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  keyIngredients: string[];
  benefits: string[];
  suitableSkinTypes: string[];
  priceRange: string;
  useTime: "Morning" | "Night" | "Both";
}

export const SKIN_TYPES = [
  { id: "Oily", name: "Oily", desc: "Excess sebum production, visible pores, and frequent shine." },
  { id: "Dry", name: "Dry", desc: "Flaky patches, tight sensation, lack of hydration." },
  { id: "Combination", name: "Combination", desc: "Oily T-zone (forehead, nose, chin) with dry cheeks." },
  { id: "Sensitive", name: "Sensitive", desc: "Prone to redness, burning, itching, or allergic reactions." }
];

export const SKIN_CONCERNS = [
  { id: "Acne", name: "Acne / Blemishes", desc: "Breakouts, whiteheads, blackheads, or hormonal acne." },
  { id: "Dark Spots", name: "Dark Spots & Pigmentation", desc: "Sun damage, acne marks (PIH), or uneven skin tone." },
  { id: "Large Pores", name: "Large / Clogged Pores", desc: "Stretched pores, blackheads, and uneven skin texture." },
  { id: "Wrinkles", name: "Aging & Wrinkles", desc: "Fine lines, loss of firmness, and sagging skin." },
  { id: "Redness", name: "Redness & Irritation", desc: "Rosacea, broken capillaries, or generic skin redness." }
];

export const COMMON_PRODUCTS = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Face Oil",
  "Exfoliant (AHA/BHA)",
  "None / Just Water"
];

export const INGREDIENTS_TO_AVOID_OPTIONS = [
  { id: "Alcohol", name: "Drying Alcohols", desc: "Can strip the lipid barrier and trigger irritation in dry or sensitive skin." },
  { id: "Fragrance", name: "Synthetic Fragrances", desc: "A common trigger for contact dermatitis and redness." },
  { id: "Sulfates", name: "Sulfates (SLS/SLES)", desc: "Harsh foaming agents that raise skin pH and cause tightness." },
  { id: "Parabens", name: "Parabens", desc: "Preservatives some users prefer to exclude for peace of mind." },
  { id: "Essential Oils", name: "Essential Oils", desc: "Unrefined botanical extracts that frequently trigger sensitivity." },
  { id: "None", name: "No specific restrictions", desc: "I do not have any known ingredient triggers to avoid." }
];

export const INGREDIENT_DATABASE: SkincareIngredient[] = [
  {
    name: "Salicylic Acid (BHA)",
    benefits: ["Exfoliates inside the pores", "Dissolves sebum and blackheads", "Reduces inflammatory breakouts"],
    description: "An oil-soluble exfoliant that penetrates deep into pore linings, making it the gold standard for congestion.",
    tags: ["Acne", "Large Pores", "Oily", "Combination"]
  },
  {
    name: "Hyaluronic Acid",
    benefits: ["Attracts up to 1000x its weight in water", "Plumps skin and minimizes fine dryness lines", "Accelerates barrier recovery"],
    description: "A supreme humectant that draws ambient moisture into the epidermis, ensuring deep, instant water hydration.",
    tags: ["Dry", "Combination", "Sensitive", "Wrinkles"]
  },
  {
    name: "Niacinamide (Vitamin B3)",
    benefits: ["Regulates oil production", "Fades post-inflammatory hyperpigmentation", "Strengthens ceramide barrier", "Calms redness"],
    description: "A versatile skin restorer that works across all concerns to balance lipids, brighten spots, and minimize pores.",
    tags: ["Oily", "Combination", "Sensitive", "Dark Spots", "Large Pores", "Acne", "Redness"]
  },
  {
    name: "Centella Asiatica (Cica)",
    benefits: ["Powerful anti-inflammatory agent", "Speeds up minor wound healing", "Rebuilds damaged epidermal barrier"],
    description: "A legendary botanical used for centuries to soothe sensitive skin, calm active breakouts, and repair stripped barriers.",
    tags: ["Sensitive", "Redness", "Acne"]
  },
  {
    name: "Retinol / Retinoids",
    benefits: ["Accelerates cellular turnover", "Stimulates collagen syntheses", "Smoothes fine lines", "Clears persistent breakouts"],
    description: "A potent Vitamin A derivative that forces healthy skin renewal and helps fade wrinkles and reverse sun damage.",
    tags: ["Wrinkles", "Dark Spots", "Large Pores", "Oily", "Dry", "Combination"]
  },
  {
    name: "Ceramides",
    benefits: ["Glues skin cells tightly together", "Forms a protective shield to keep moisture in", "Repels environmental irritants"],
    description: "Crucial intercellular lipids that reconstitute the skin's physical shield, perfect for recovering sensitive or dry states.",
    tags: ["Dry", "Sensitive", "Redness", "Wrinkles"]
  },
  {
    name: "Vitamin C (L-Ascorbic Acid)",
    benefits: ["Neutralizes free radicals", "Suppresses pigment overproduction", "Boosts morning UV filter efficiency"],
    description: "A powerful antioxidant that brightens dullness, fights dark spots, and plays an essential role in collagen support.",
    tags: ["Dark Spots", "Wrinkles", "Dullness"]
  },
  {
    name: "Azelaic Acid",
    benefits: ["Exerts mild antibacterial activity", "Dramatically reduces chronic redness", "Smoothes textured blemish spots"],
    description: "A dicarboxylic acid that gently calms hyper-reactive skin pathways, addressing both mild acne and rosacea-like symptoms.",
    tags: ["Redness", "Sensitive", "Acne", "Dark Spots"]
  }
];

export const PRODUCT_DATABASE: SkincareProduct[] = [
  {
    id: "prod-1",
    name: "Centella Calming Gel Cleanser",
    brand: "Aura Derm",
    category: "Cleanser",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Centella Asiatica", "Glycerin", "Green Tea"],
    benefits: ["Soothes active inflammation", "Cleanses without stripping essential oils", "Maintains pH 5.5 balance"],
    suitableSkinTypes: ["Sensitive", "Dry", "Combination", "Oily"],
    priceRange: "$$",
    useTime: "Both"
  },
  {
    id: "prod-2",
    name: "Beta-Salicylic Pore Clarifying Serum",
    brand: "Lumi Science",
    category: "Serum",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Salicylic Acid (BHA) 2%", "Niacinamide", "Tea Tree"],
    benefits: ["Clears deep sebum clogs", "Refines large stretched pores", "Calms red acne breakouts"],
    suitableSkinTypes: ["Oily", "Combination"],
    priceRange: "$$$",
    useTime: "Night"
  },
  {
    id: "prod-3",
    name: "Hydro-Plump Moisture Surge",
    brand: "Aqua Flora",
    category: "Moisturizer",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80b36?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Hyaluronic Acid", "Ceramides", "Squalane"],
    benefits: ["Draws 72hr continuous water moisture", "Saves dehydrated flaky skin", "Leaves a silky cloud-like finish"],
    suitableSkinTypes: ["Dry", "Combination", "Sensitive"],
    priceRange: "$$",
    useTime: "Both"
  },
  {
    id: "prod-4",
    name: "Barrier Reset Ceramide Balm",
    brand: "Dermaceutic",
    category: "Moisturizer",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Ceramides Complex", "Panthenol (B5)", "Cica Extract"],
    benefits: ["Seals micro-cracks in skin surface", "Ends instant itching and tightness", "Overcomes compromised dry barrier"],
    suitableSkinTypes: ["Dry", "Sensitive"],
    priceRange: "$$$",
    useTime: "Night"
  },
  {
    id: "prod-5",
    name: "Brighten-C Shield SPF 50+",
    brand: "Sol Protection",
    category: "Sunscreen",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Zinc Oxide", "Vitamin C", "Niacinamide"],
    benefits: ["Broad-spectrum UVA/UVB blockage", "Prevents fresh dark spot ignition", "Leaves no white cast or greasy finish"],
    suitableSkinTypes: ["Oily", "Dry", "Combination", "Sensitive"],
    priceRange: "$$",
    useTime: "Morning"
  },
  {
    id: "prod-6",
    name: "Multi-Vitamin Anti-Age Complex",
    brand: "Aura Derm",
    category: "Serum",
    image: "https://images.unsplash.com/photo-1615396879814-4901929343df?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Retinol 0.5%", "Peptides", "Coenzyme Q10"],
    benefits: ["Fades expression line depths", "Tightens relaxed cheek contours", "Fades solar pigmentation patches"],
    suitableSkinTypes: ["Oily", "Dry", "Combination"],
    priceRange: "$$$$",
    useTime: "Night"
  },
  {
    id: "prod-7",
    name: "Rosacalm Azelaic Concentrate",
    brand: "Dermaceutic",
    category: "Serum",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Azelaic Acid 10%", "Centella Asiatica", "Bisabolol"],
    benefits: ["Cools burning hot zones", "Stops chronic diffuse cheeks redness", "Maintains highly sensitive epidermal layer balance"],
    suitableSkinTypes: ["Sensitive", "Dry", "Combination"],
    priceRange: "$$$",
    useTime: "Both"
  },
  {
    id: "prod-8",
    name: "Ultra-Light Oil Control Hydrator",
    brand: "Lumi Science",
    category: "Moisturizer",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
    keyIngredients: ["Niacinamide 4%", "Zinc PCA", "Salicylic Acid"],
    benefits: ["Matte velvet control all day", "Prevents pore expansion stretch", "Lightweight watery feel"],
    suitableSkinTypes: ["Oily", "Combination"],
    priceRange: "$$",
    useTime: "Both"
  }
];

export function getSkincareRecommendations(
  skinType: string,
  concerns: string[],
  avoidIngredients: string[]
) {
  // Filter ingredients:
  // Match if ingredient tags contain skin type OR any of skin concerns, and is not excluded.
  const filteredIngredients = INGREDIENT_DATABASE.filter((ing) => {
    // Check if user excluded by name or category
    const isExcluded = avoidIngredients.some((avoid) => {
      const lowerAvoid = avoid.toLowerCase();
      const lowerIngName = ing.name.toLowerCase();
      return (
        lowerIngName.includes(lowerAvoid) ||
        (lowerAvoid.includes("sulfates") && lowerIngName.includes("sulfate")) ||
        (lowerAvoid.includes("alcohol") && lowerIngName.includes("alcohol")) ||
        (lowerAvoid.includes("fragrance") && lowerIngName.includes("fragrance"))
      );
    });

    if (isExcluded) return false;

    // Check matchmaking
    const matchesType = ing.tags.includes(skinType);
    const matchesConcern = concerns.some((concern) => ing.tags.includes(concern));
    return matchesType || matchesConcern;
  });

  // Filter products:
  // Must be suitable for skinType and should not contain any of the avoidIngredients.
  // And ideally match some categories related to their concerns.
  const filteredProducts = PRODUCT_DATABASE.filter((prod) => {
    // Skin type check
    const matchesSkin = prod.suitableSkinTypes.includes(skinType);
    if (!matchesSkin) return false;

    // Avoid ingredient check
    const containsAvoided = avoidIngredients.some((avoid) => {
      const lowerAvoid = avoid.toLowerCase();
      return prod.keyIngredients.some((ing) => {
        const lowerIng = ing.toLowerCase();
        return (
          lowerIng.includes(lowerAvoid) ||
          (lowerAvoid.includes("alcohol") && lowerIng.includes("alcohol")) ||
          (lowerAvoid.includes("sulfates") && lowerIng.includes("sulfate")) ||
          (lowerAvoid.includes("fragrance") && lowerIng.includes("fragrance"))
        );
      });
    });

    if (containsAvoided) return false;

    return true;
  });

  // Sort products to highlight ones that contain recommended active ingredients
  const activeIngNames = filteredIngredients.map((i) => i.name.toLowerCase());
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aMatches = a.keyIngredients.filter((ki) =>
      activeIngNames.some((ai) => ki.toLowerCase().includes(ai) || ai.includes(ki.toLowerCase()))
    ).length;
    const bMatches = b.keyIngredients.filter((ki) =>
      activeIngNames.some((ai) => ki.toLowerCase().includes(ai) || ai.includes(ki.toLowerCase()))
    ).length;
    return bMatches - aMatches; // Descending matches
  });

  return {
    ingredients: filteredIngredients.slice(0, 4), // pick top 4 ingredients
    products: sortedProducts.slice(0, 4) // pick top 4 recommended products
  };
}
