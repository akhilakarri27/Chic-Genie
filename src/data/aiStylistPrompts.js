import { MOCK_OUTFITS } from './mockOutfits';

/**
 * Categorized Fashion Styles for AI Stylist & Editorial Intelligence
 */
export const FASHION_STYLE_CATEGORIES = [
  {
    category: 'EVERYDAY',
    icon: '✨',
    styles: [
      { id: 'casual', label: 'Casual', desc: 'Relaxed, effortless every-day ease' },
      { id: 'smart_casual', label: 'Smart Casual', desc: 'Polished balance of formal and casual' },
      { id: 'minimal', label: 'Minimal', desc: 'Clean lines, quiet luxury & neutral tones' },
      { id: 'clean_girl', label: 'Clean Girl', desc: 'Sleek, dewy, minimalist chic' },
      { id: 'cute', label: 'Cute', desc: 'Soft pastel knits, delicate details' }
    ]
  },
  {
    category: 'ELEGANT',
    icon: '👑',
    styles: [
      { id: 'elegant', label: 'Elegant', desc: 'Flowing silks, tailored drape, graceful lines' },
      { id: 'classy', label: 'Classy', desc: 'Timeless poise and refined composure' },
      { id: 'quiet_luxury', label: 'Quiet Luxury', desc: 'Noble fabrics, subtle tailoring & unbranded elegance' },
      { id: 'old_money', label: 'Old Money', desc: 'Heritage linen, cable knits, pearls & classic prestige' },
      { id: 'romantic', label: 'Romantic', desc: 'Fluid drapes, delicate ruffles, soft pastels & lace' },
      { id: 'feminine', label: 'Feminine', desc: 'Graceful silhouettes with delicate accents' }
    ]
  },
  {
    category: 'TRENDY',
    icon: '🔥',
    styles: [
      { id: 'streetwear', label: 'Streetwear', desc: 'Boxy cuts, statement sneakers & layers' },
      { id: 'y2k', label: 'Y2K', desc: 'Playful early-2000s revival energy' },
      { id: 'coquette', label: 'Coquette', desc: 'Dainty ribbons, lace trim, ballet flats & soft charm' },
      { id: 'soft_girl', label: 'Soft Girl', desc: 'Sweet pastel tones, cozy textures' },
      { id: 'edgy', label: 'Edgy', desc: 'Structured leather, dark hues & metal hardware' }
    ]
  },
  {
    category: 'ETHNIC & INDO-WESTERN',
    icon: '🪷',
    styles: [
      { id: 'traditional', label: 'Traditional', desc: 'Artisanal handlooms, zari & rich silks' },
      { id: 'festive', label: 'Festive', desc: 'Celebratory grandeur, vibrant celebratory tones' },
      { id: 'modern_ethnic', label: 'Modern Ethnic', desc: 'Contemporary silhouettes with Indian heritage motifs' },
      { id: 'indo_western', label: 'Indo-Western', desc: 'Fusion of ethnic drapes with tailored western cuts' }
    ]
  },
  {
    category: 'LIFESTYLE & RESORT',
    icon: '🌴',
    styles: [
      { id: 'sporty', label: 'Sporty', desc: 'High-performance activewear styling' },
      { id: 'athleisure', label: 'Athleisure', desc: 'Gym-to-street stylish comfort' },
      { id: 'resort', label: 'Resort', desc: 'Sun-drenched luxury, linen & breezy fluid cuts' },
      { id: 'vacation', label: 'Vacation', desc: 'Tropical ease, lightweight prints' },
      { id: 'beachwear', label: 'Beachwear', desc: 'Airy cover-ups, sun hats, breezy coords' }
    ]
  },
  {
    category: 'AESTHETICS',
    icon: '🎨',
    styles: [
      { id: 'boho', label: 'Boho', desc: 'Flowy tiers, natural textures, earthy tones' },
      { id: 'vintage', label: 'Vintage', desc: 'Nostalgic retro charm & archival cuts' },
      { id: 'dark_academia', label: 'Dark Academia', desc: 'Tweed blazers, plaid skirts, turtlenecks & oxford shoes' },
      { id: 'light_academia', label: 'Light Academia', desc: 'Ivory linen, beige trench coats, poet blouses & gold studs' },
      { id: 'cottagecore', label: 'Cottagecore', desc: 'Prairie florals, puff sleeves, idyllic linen' },
      { id: 'korean_inspired', label: 'Korean-Inspired', desc: 'Clean silhouettes, oversized blazers, pastel minimalism' },
      { id: 'preppy', label: 'Preppy', desc: 'Collared shirts, pleated skirts, cricket knits' }
    ]
  },
  {
    category: 'FORMAL & GLAMOUR',
    icon: '💼',
    styles: [
      { id: 'business_formal', label: 'Business Formal', desc: 'Sharp tailoring, power suiting & precision cuts' },
      { id: 'business_casual', label: 'Business Casual', desc: 'Smart separates for modern workspaces' },
      { id: 'glamorous', label: 'Glamorous', desc: 'High-octane red carpet sparkle & satin' },
      { id: 'party', label: 'Party', desc: 'Statement night-out silhouettes & metallics' },
      { id: 'western', label: 'Western', desc: 'Classic international contemporary silhouettes' }
    ]
  }
];

/**
 * Categorized Outfit Types for AI Stylist & Recommendation Engine
 */
export const OUTFIT_TYPE_CATEGORIES = [
  {
    category: 'WESTERN & SEPARATES',
    icon: '👖',
    items: [
      'Top + Jeans', 'Top + Trousers', 'Top + Skirt', 'Top + Shorts', 'Top + Wide-Leg Pants',
      'Shirt + Jeans', 'Shirt + Trousers', 'Shirt + Skirt'
    ]
  },
  {
    category: 'DRESSES',
    icon: '👗',
    items: [
      'Dress', 'Mini Dress', 'Midi Dress', 'Maxi Dress', 'Bodycon Dress', 'A-Line Dress', 'Shirt Dress'
    ]
  },
  {
    category: 'ETHNIC & HERITAGE',
    icon: '🥻',
    items: [
      'Saree', 'Saree + Contemporary Blouse', 'Lehenga', 'Anarkali', 'Salwar Suit', 'Sharara', 'Palazzo Set', 'Kurti + Palazzo', 'Kurti + Skirt', 'Kurti + Straight Pants'
    ]
  },
  {
    category: 'INDO-WESTERN & FUSION',
    icon: '💫',
    items: [
      'Kurti + Jeans', 'Co-ord Set', 'Draped Skirt Set', 'Indo-Western Jumpsuit'
    ]
  },
  {
    category: 'FORMAL & TAILORED',
    icon: '💼',
    items: [
      'Blazer + Trousers', 'Blazer + Jeans', 'Waistcoat + Trousers', 'Cardigan + Skirt', 'Jumpsuit', 'Romper'
    ]
  },
  {
    category: 'SPORTS, TRAVEL & RESORT',
    icon: '✈️',
    items: [
      'Athleisure Set', 'Gym Outfit', 'Travel Outfit', 'Airport Look', 'Beach Look', 'Resort Look'
    ]
  }
];

/**
 * Categorized Suggested Prompts (6 Distinct Fashion Categories)
 */
export const CATEGORIZED_PROMPTS = {
  OCCASIONS: [
    "What should I wear to college?",
    "What should I wear to an interview?",
    "Help me style a wedding outfit.",
    "What should I wear to a birthday party?",
    "Give me a date-night outfit.",
    "Help me choose a festival outfit.",
    "What should I wear for a casual brunch?",
    "Create an outfit for a college presentation.",
    "What should I wear to an office party?",
    "Give me a vacation outfit."
  ],
  STYLE: [
    "Give me a quiet luxury look.",
    "Create a clean girl outfit.",
    "Give me a cute and feminine look.",
    "Create a minimal outfit.",
    "Give me a trendy streetwear look.",
    "Create an elegant outfit.",
    "Give me a soft girl look.",
    "Create an old-money inspired outfit.",
    "Give me a Korean-inspired outfit.",
    "Create an Indo-Western look."
  ],
  OUTFIT_TYPE: [
    "Style a black dress for me.",
    "Help me style wide-leg jeans.",
    "How can I style a white shirt?",
    "Give me different ways to wear a kurti.",
    "Help me style a saree.",
    "How can I style a blazer?",
    "Give me a co-ord outfit.",
    "How can I style a denim jacket?"
  ],
  COLOR: [
    "What goes well with beige?",
    "How can I style burgundy?",
    "What colors work with navy?",
    "Give me a pastel outfit.",
    "Create a monochrome look.",
    "Give me a neutral outfit.",
    "Create a colorful outfit.",
    "What colors pair well with olive green?"
  ],
  WEATHER: [
    "What should I wear in hot weather?",
    "Create a rainy-day outfit.",
    "What should I wear in cold weather?",
    "Give me a comfortable summer outfit.",
    "Create a winter layering look."
  ],
  TRANSFORM_MY_LOOK: [
    "Make this look more elegant.",
    "Make this outfit more casual.",
    "Make it more trendy.",
    "Make it more feminine.",
    "Make it more minimal.",
    "Make it more comfortable.",
    "Make it more formal.",
    "Make it more youthful.",
    "Make it more sophisticated.",
    "Give me a completely different version."
  ]
};

// Flattened list for quick display & backward compatibility
export const SUGGESTED_PROMPTS = [
  'What should I wear to college?',
  'Give me a quiet luxury look.',
  'Make this look more elegant.',
  'What colors go well with beige?',
  'Help me style a wedding outfit.',
  'Make it more comfortable.',
  'Give me a clean girl outfit.',
  'Create an Indo-Western look.',
  'Give me a completely different version.'
];

/**
 * AI Stylist Quick Action Triggers
 */
export const QUICK_ACTIONS = [
  { id: 'create_look', label: '✨ Create a Look', prompt: 'Curate a complete signature look for me today.' },
  { id: 'change_colors', label: '🎨 Change Colors', prompt: 'Suggest an alternative color palette for this outfit.' },
  { id: 'change_outfit', label: '👗 Change Outfit', prompt: 'Give me a different outfit silhouette with the same aesthetic.' },
  { id: 'change_shoes', label: '👟 Change Shoes', prompt: 'What alternative footwear would elevate this look?' },
  { id: 'add_accessories', label: '💍 Add Accessories', prompt: 'Recommend finishing touches, jewellery and handbag pairings.' },
  { id: 'dress_weather', label: '🌤️ Dress for Weather', prompt: 'Adapt this look for current weather conditions.' },
  { id: 'dress_occasion', label: '💼 Dress for Occasion', prompt: 'Fine-tune this outfit for an upcoming special occasion.' },
  { id: 'give_alternatives', label: '🔄 Give Me Alternatives', prompt: 'Give me another interpretation of this look.' }
];

/**
 * Intelligent AI Stylist Mock Reasoning & Recommendation Engine
 */
export function getAIStylistResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  // 1. TRANSFORM REQUESTS
  if (msg.includes('more elegant') || msg.includes('sophisticated')) {
    return {
      text: "Absolutely. I'll keep your original outfit structure but refine the styling with cleaner silhouettes, refined accessories, and a more sophisticated color balance.",
      recommendedLook: MOCK_OUTFITS[2] || MOCK_OUTFITS[0],
      stylingTips: [
        'Swap matte cotton for fluid silk, satin, or fine gauge wool.',
        'Add a minimalist champagne gold link watch and micro-pearl earrings.',
        'Choose pointed-toe kitten heel mules or sleek leather loafers.'
      ]
    };
  }

  if (msg.includes('more comfortable') || msg.includes('relaxed') || msg.includes('ease')) {
    return {
      text: "I'll keep the same overall style while switching toward relaxed silhouettes, breathable fabrics, and comfortable footwear.",
      recommendedLook: MOCK_OUTFITS[4] || MOCK_OUTFITS[0],
      stylingTips: [
        'Opt for pre-washed breathable linen or brushed organic cotton.',
        'Pair with cushioned white leather sneakers or memory-foam ballet flats.',
        'Choose a lightweight slouchy tote instead of rigid structured bags.'
      ]
    };
  }

  if (msg.includes('different version') || msg.includes('another option') || msg.includes('alternatives') || msg.includes('surprise')) {
    return {
      text: "Of course. Here's another interpretation of the same preferences with a different silhouette and color combination.",
      recommendedLook: MOCK_OUTFITS[5] || MOCK_OUTFITS[1],
      stylingTips: [
        'Shift the focal point from topwear to a dramatic wide-leg trouser.',
        'Experiment with contrasting tonal textures (ribbed knit with crisp poplin).',
        'Add a structured trench coat or cropped blazer for architectural depth.'
      ]
    };
  }

  if (msg.includes('more casual')) {
    return {
      text: "Transforming this look for a laid-back setting! We'll relax the tailoring with vintage-wash straight denim, a clean boxy tee, and minimalist leather trainers.",
      recommendedLook: MOCK_OUTFITS[0],
      stylingTips: [
        'Unbutton the top two buttons and roll the sleeves once.',
        'Switch out leather satchels for an aesthetic canvas tote.',
        'Dainty hoops replace formal statement jewellery.'
      ]
    };
  }

  if (msg.includes('more trendy') || msg.includes('streetwear') || msg.includes('y2k')) {
    return {
      text: "Injecting modern runway edge! We'll incorporate wide-leg cargo pants, an oversized blazer silhouette, and chunky retro runners.",
      recommendedLook: MOCK_OUTFITS[5] || MOCK_OUTFITS[0],
      stylingTips: [
        'Layer a fine ribbed knit under an unbuttoned oversized blazer.',
        'Add narrow rectangular sunglasses and chunky silver hoop earrings.',
        'Carry a metallic silver or deep plum mini baguette bag.'
      ]
    };
  }

  if (msg.includes('more feminine') || msg.includes('cute') || msg.includes('soft girl') || msg.includes('coquette')) {
    return {
      text: "Emphasizing soft romance! We're pairing delicate dusty rose knits with knife-pleated midi hemlines, dainty bows, and patent ballet flats.",
      recommendedLook: MOCK_OUTFITS[8] || MOCK_OUTFITS[2],
      stylingTips: [
        'Add sheer lace or pearl hair clips for extra sweetness.',
        'Keep the handbag petite with subtle gold chain hardware.',
        'A sweep of rose cream blush harmonizes with the soft pastel tones.'
      ]
    };
  }

  if (msg.includes('more minimal') || msg.includes('clean girl') || msg.includes('quiet luxury') || msg.includes('old money')) {
    return {
      text: "Channeling pure quiet luxury! Focusing on unbranded perfection: an ivory silk blouse, tailored oatmeal trousers, deep mocha accents, and subtle gold jewelry.",
      recommendedLook: MOCK_OUTFITS[4] || MOCK_OUTFITS[1],
      stylingTips: [
        'Adhere to a strict two-tone neutral palette (Ivory + Mocha or Black + Taupe).',
        'Ensure garments are impeccably pressed with sharp center creases.',
        'Finish with a classic leather belt and polished loafers.'
      ]
    };
  }

  if (msg.includes('more formal') || msg.includes('more professional') || msg.includes('interview') || msg.includes('business')) {
    return {
      text: "Power tailoring with distinction! A double-breasted suit in deep plum purple or charcoal navy, structured with an ivory silk camisole and leather loafers.",
      recommendedLook: MOCK_OUTFITS[1],
      stylingTips: [
        'Keep silhouettes crisp at the shoulder line and straight through the trouser leg.',
        'A structured leather satchel with laptop compartment is both sleek and functional.',
        'Champagne gold watch and subtle stud earrings complete the executive presence.'
      ]
    };
  }

  // 2. OCCASIONS
  if (msg.includes('college') || msg.includes('university') || msg.includes('campus') || msg.includes('presentation')) {
    return {
      text: "For college, effortless chic is all about combining casual comfort with put-together polish. A blush oversized linen button-down with vintage straight-leg denim and clean white trainers keeps you comfortable from morning lectures to cafe study sessions.",
      recommendedLook: MOCK_OUTFITS[0],
      stylingTips: [
        'Roll the shirt cuffs once for a relaxed, intentional silhouette.',
        'Use a structured canvas or leather tote that fits a 13-inch laptop.',
        'Opt for hypoallergenic gold huggies for all-day comfortable sparkle.'
      ]
    };
  }

  if (msg.includes('wedding') || msg.includes('festival') || msg.includes('saree') || msg.includes('lehenga') || msg.includes('reception')) {
    return {
      text: "For royal celebrations, organza and Banarasi silks in soft pastel lavender and muted plum offer regal grandeur with modern lightness. Paired with antique gold zari embroidery, artisanal potli bags, and cushioned pearl juttis.",
      recommendedLook: MOCK_OUTFITS[3],
      stylingTips: [
        'Let the pallu flow naturally over your wrist to showcase the zari craftsmanship.',
        'Pair with antique temple jhumkas and delicate gold polki bangles.',
        'Fresh jasmine flowers (gajra) in a sleek braided bun complete the heritage charm.'
      ]
    };
  }

  if (msg.includes('date') || msg.includes('dinner') || msg.includes('cocktail') || msg.includes('birthday') || msg.includes('party')) {
    return {
      text: "For golden hour cocktails or an alluring dinner date, a bias-cut silk satin midi slip dress in dusty champagne rose creates fluid motion and radiant elegance.",
      recommendedLook: MOCK_OUTFITS[2],
      stylingTips: [
        'Layer delicate micro-pearls with a fine 18k gold chain for dimensional luster.',
        'A sleek low chignon hairstyle accentuates the cowl neckline effortlessly.',
        'Choose a minimal silk clutch in warm metallic champagne.'
      ]
    };
  }

  if (msg.includes('vacation') || msg.includes('resort') || msg.includes('beach') || msg.includes('brunch') || msg.includes('travel') || msg.includes('airport')) {
    return {
      text: "For vacation and breezy resort escapes, lightweight linen coordinates in sand oatmeal and ivory deliver sun-drenched quiet luxury with maximum mobility.",
      recommendedLook: MOCK_OUTFITS[4],
      stylingTips: [
        'Pair with woven raffia tote bags and minimalist leather slides.',
        'Tortoise-shell cat-eye sunglasses introduce organic warmth to oatmeal tones.',
        'Pack a lightweight silk-cashmere scarf for air-conditioned transit.'
      ]
    };
  }

  // 3. COLOR COORDINATION
  if (msg.includes('beige') || msg.includes('burgundy') || msg.includes('navy') || msg.includes('olive') || msg.includes('pastel') || msg.includes('color')) {
    return {
      text: "High-fashion color theory favors thoughtful tonal pairing! For instance, pairing warm sand beige with deep plum purple (#321044) and champagne gold accents creates striking editorial harmony without visual clutter.",
      recommendedLook: MOCK_OUTFITS[4] || MOCK_OUTFITS[0],
      stylingTips: [
        'Apply the 60-30-10 rule: 60% dominant neutral, 30% secondary hue, 10% metallic accent.',
        'Mix matte fabrics (cotton, linen) with subtle sheens (silk, gold hardware).',
        'A deep plum lip or manicure provides an exquisite focal contrast.'
      ]
    };
  }

  // 4. WEATHER ADVICE
  if (msg.includes('hot') || msg.includes('summer') || msg.includes('rainy') || msg.includes('cold') || msg.includes('winter') || msg.includes('weather')) {
    return {
      text: "Dressing for the elements without compromising on silhouette! For warm weather, pure organic linen and breathable cotton poplin keep body temperature cool while holding crisp tailored shapes.",
      recommendedLook: MOCK_OUTFITS[0],
      stylingTips: [
        'Choose loose-weave natural fibers (linen, modal, silk-cotton) over synthetics.',
        'Opt for open neckline collar styles and wide-leg trousers for air circulation.',
        'Layer with a light draped cardigan if entering air-conditioned spaces.'
      ]
    };
  }

  // 5. SPECIFIC OUTFIT TYPES
  if (msg.includes('kurti') || msg.includes('indo-western') || msg.includes('palazzo') || msg.includes('anarkali')) {
    return {
      text: "Indo-Western fusion is having a massive high-fashion moment! A straight-cut artisanal cotton-silk kurti styled over wide-leg vintage denim or linen palazzos effortlessly marries heritage with contemporary street poise.",
      recommendedLook: MOCK_OUTFITS[7] || MOCK_OUTFITS[3],
      stylingTips: [
        'Roll the kurti sleeves to three-quarter length and add silver oxidized kada bangles.',
        'Pair with embroidered juttis or minimalist leather slides.',
        'Carry a structured crossbody bag to anchor the fluid drape.'
      ]
    };
  }

  if (msg.includes('dress') || msg.includes('skirt') || msg.includes('blazer') || msg.includes('jeans')) {
    return {
      text: "Here is an exquisite tailored ensemble designed to celebrate your silhouette with quiet confidence and impeccable proportions.",
      recommendedLook: MOCK_OUTFITS[1] || MOCK_OUTFITS[2],
      stylingTips: [
        'Balance proportions: Pair oversized tops with streamlined bottoms, or vice versa.',
        'Use a fine belt to gently define the waistline without restricting movement.',
        'Keep accessories curated: one statement piece and dainty supporting accents.'
      ]
    };
  }

  // DEFAULT / GENERAL RESPONSE
  return {
    text: "I love exploring unique styling formulas with you! Based on your style preferences, I recommend focusing on harmonious color pairings, intentional silhouettes, and one standout hero piece. Here is an editorial look tailored for you:",
    recommendedLook: MOCK_OUTFITS[0],
    stylingTips: [
      'Focus on the 70/30 rule: 70% harmonious base garments, 30% statement accessories.',
      'Always consider fabric texture interplay (matte versus subtle sheen).',
      'Wear what makes you feel poised, radiant, and effortlessly confident.'
    ]
  };
}
