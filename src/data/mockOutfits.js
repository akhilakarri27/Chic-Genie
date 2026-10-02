// Helper function to build structured outfits systematically
function createOutfit({
  id,
  name,
  category = 'Western',
  subCategory = 'Separates',
  style = 'Casual Chic',
  styles = ['casual_vibe', 'minimal'],
  occasion = 'casual',
  occasions = ['casual', 'college'],
  weather = ['warm', 'pleasant'],
  season = 'All Season',
  outfitType = 'jeans_top',
  top = null,
  bottom = null,
  dress = null,
  layer = null,
  color = 'deep_plum',
  colorFamily = 'dark',
  colors = ['deep_plum', 'black'],
  paletteMood = 'dark_moody',
  fit = 'regular',
  silhouette = 'tailored',
  neckline = 'v-neck',
  waistDefinition = 'cinched',
  bodyShapeCompatibility = ['hourglass', 'pear', 'rectangle', 'inverted_triangle', 'oval'],
  comfort = 'balanced',
  formality = 'Casual',
  footwear = 'Ballet Flats',
  accessories = 'Dainty chain necklace',
  bag = 'Leather shoulder bag',
  jewellery = 'Gold hoop earrings',
  description = '',
  avatarUrl = '/avatars/casual_chic.jpg',
  tags = ['Chic Genie Curated']
}) {
  return {
    id,
    name,
    category,
    subCategory,
    style,
    styles,
    occasion,
    occasions,
    weather,
    season,
    outfitType,
    top,
    bottom,
    dress,
    layer,
    color,
    colorFamily,
    colors,
    paletteMood,
    palette: paletteMood,
    fit,
    silhouette,
    neckline,
    waistDefinition,
    bodyShapeCompatibility,
    comfort,
    formality,
    footwear,
    accessories,
    bag,
    jewellery,
    description: description || `${name} featuring ${dress || top || 'curated separates'} in ${color.replace('_', ' ')} with ${footwear}.`,
    avatarUrl,
    tags,
    preferenceMatch: 95,
    explanation: `Chic Genie curated this look to harmonize with your selected silhouette, aesthetic mood, and event requirements.`,
    quickTransforms: {
      trendier: { top: 'Cropped designer silhouette', bottom: 'Wide-leg high-waist pants', footwear: 'Chunky platform sneakers', bag: 'Metallic baguette bag', jewellery: 'Chunky link chain' },
      cuter: { top: 'Pastel puff-sleeve knit', bottom: 'Pleated midi skirt', footwear: 'Mary Jane flats', bag: 'Petite pearl crossbody', jewellery: 'Pearl floral studs' },
      more_elegant: { top: 'Silk georgette blouse', bottom: 'Fluid tailored trousers', footwear: 'Pointed kitten heel pumps', bag: 'Structured top-handle tote', jewellery: 'Layered pearl necklace' },
      more_minimal: { top: 'Clean organic cotton tee', bottom: 'Straight-leg slacks', footwear: 'Minimal leather trainers', bag: 'Seamless black tote', jewellery: 'Fine gold band ring' },
      more_casual: { top: 'Relaxed boyfriend tee', bottom: 'Distressed vintage denim', footwear: 'Canvas low-tops', bag: 'Canvas shopper tote', jewellery: 'Minimal huggies' },
      more_formal: { top: 'Structured silk shirt', bottom: 'Crepe cigarette trousers', footwear: 'Polished penny loafers', bag: 'Structured briefcase satchel', jewellery: 'Classic tank watch' }
    }
  };
}

export const MOCK_OUTFITS = [
  // 1. WESTERN & CASUAL DRESSES
  createOutfit({
    id: 'outfit-001-wrap-midi-plum',
    name: 'Deep Plum Silk Wrap Midi Dress',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Elegant & Romantic',
    styles: ['elegant', 'romantic', 'classy', 'quiet_luxury'],
    occasion: 'date',
    occasions: ['date', 'party', 'office'],
    weather: ['warm', 'pleasant'],
    season: 'All Season',
    outfitType: 'wrap_dress',
    dress: 'Deep plum pure silk wrap midi dress with self-tie sash',
    color: 'deep_plum',
    colorFamily: 'dark',
    colors: ['deep_plum', 'burgundy', 'wine', 'black'],
    paletteMood: 'dark_moody',
    fit: 'regular',
    silhouette: 'wrap',
    neckline: 'v-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'pear', 'rectangle', 'inverted_triangle', 'oval'],
    comfort: 'balanced',
    formality: 'Semi-Formal',
    footwear: 'Pointed kitten heels in black nappa leather',
    bag: 'Burgundy structured mini satchel',
    jewellery: '18k champagne gold layered pendant and pearl huggies',
    avatarUrl: '/avatars/elegant_dress.jpg',
    tags: ['Wrap Dress', 'Deep Plum', 'Cinched Waist', 'Silk Satin']
  }),
  createOutfit({
    id: 'outfit-002-bodycon-cocktail-noir',
    name: 'Midnight Noir Sculpted Bodycon Midi',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Glamorous & Statement',
    styles: ['glamorous', 'party', 'edgy', 'dark_feminine'],
    occasion: 'party',
    occasions: ['party', 'date', 'wedding'],
    weather: ['pleasant', 'cold'],
    season: 'Autumn/Winter',
    outfitType: 'bodycon_dress',
    dress: 'Sculpted midnight black jersey bodycon midi with subtle shoulder pads',
    color: 'deep_black',
    colorFamily: 'dark',
    colors: ['deep_black', 'black', 'charcoal', 'metallic_gold'],
    paletteMood: 'night_out',
    fit: 'fitted',
    silhouette: 'bodycon',
    neckline: 'square-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'inverted_triangle'],
    comfort: 'style_first',
    formality: 'Formal',
    footwear: 'Metallic gold stiletto pumps with pointed toe',
    bag: 'Crystal-embellished evening minaudière',
    jewellery: 'Cascading rhinestone drop earrings and gold cuff',
    avatarUrl: '/avatars/party_glam.jpg',
    tags: ['Bodycon', 'Midnight Noir', 'Hourglass Glamour', 'Cocktail']
  }),
  createOutfit({
    id: 'outfit-003-a-line-emerald-midi',
    name: 'Emerald Green Pleated A-Line Midi Dress',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Classy & Refined',
    styles: ['classy', 'elegant', 'quiet_luxury', 'feminine'],
    occasion: 'office',
    occasions: ['office', 'casual', 'party'],
    weather: ['pleasant', 'warm'],
    season: 'Spring/Summer',
    outfitType: 'a_line_dress',
    dress: 'Jewel-toned emerald green chiffon A-line dress with accordion pleated skirt',
    color: 'emerald',
    colorFamily: 'bold',
    colors: ['emerald', 'forest_green', 'teal', 'gold'],
    paletteMood: 'jewel_tones',
    fit: 'regular',
    silhouette: 'a-line',
    neckline: 'boat-neck',
    waistDefinition: 'belted',
    bodyShapeCompatibility: ['pear', 'hourglass', 'oval', 'rectangle'],
    comfort: 'comfort_first',
    formality: 'Business Casual',
    footwear: 'Nude leather slingbacks with kitten heel',
    bag: 'Cognac leather top-handle work bag',
    jewellery: 'Emerald stone studs and delicate gold chain',
    avatarUrl: '/avatars/elegant_dress.jpg',
    tags: ['A-Line', 'Emerald Jewel', 'Pear Friendly', 'Pleated']
  }),
  createOutfit({
    id: 'outfit-004-slip-dress-rose-cashmere',
    name: 'Dusty Rose Silk Slip & Cashmere Wrap',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Romantic & Feminine',
    styles: ['romantic', 'feminine', 'soft_girl', 'coquette'],
    occasion: 'date',
    occasions: ['date', 'party', 'casual'],
    weather: ['warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'slip_dress',
    dress: 'Bias-cut dusty rose fluid silk satin midi slip with cowl neck',
    layer: 'Feather-light cream cashmere draped wrap',
    color: 'rose_pink',
    colorFamily: 'pinks',
    colors: ['rose_pink', 'blush', 'pink', 'cream'],
    paletteMood: 'soft_feminine',
    fit: 'flowy',
    silhouette: 'column',
    neckline: 'cowl',
    waistDefinition: 'semi-fitted',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'oval', 'inverted_triangle'],
    comfort: 'style_first',
    formality: 'Semi-Formal',
    footwear: 'Delicate champagne strappy kitten heels',
    bag: 'Silk mini clutch with fine gold chain',
    jewellery: 'Freshwater pearl necklace and dainty pearl studs',
    avatarUrl: '/avatars/elegant_dress.jpg',
    tags: ['Silk Slip', 'Dusty Rose', 'Romantic Fluid', 'Candlelight']
  }),
  createOutfit({
    id: 'outfit-005-shirt-dress-belted-poplin',
    name: 'Crisp White Poplin Belted Shirt Dress',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Clean Girl & Minimal',
    styles: ['clean_girl', 'minimal', 'smart_casual'],
    occasion: 'college',
    occasions: ['college', 'casual', 'travel', 'office'],
    weather: ['warm', 'hot', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'shirt_dress',
    dress: 'Crisp ivory poplin button-down shirt dress with wide fabric belt',
    color: 'white',
    colorFamily: 'neutrals',
    colors: ['white', 'off_white', 'beige', 'tan'],
    paletteMood: 'minimal_chic',
    fit: 'regular',
    silhouette: 'tailored',
    neckline: 'collared',
    waistDefinition: 'belted',
    bodyShapeCompatibility: ['rectangle', 'hourglass', 'pear', 'oval'],
    comfort: 'comfort_first',
    formality: 'Smart Casual',
    footwear: 'Classic leather penny loafers in rich tan',
    bag: 'Structured canvas and leather tote',
    jewellery: 'Minimalist gold link bracelet and huggies',
    avatarUrl: '/avatars/casual_chic.jpg',
    tags: ['Shirt Dress', 'Clean Girl', 'Crisp Poplin', 'Belted']
  }),
  createOutfit({
    id: 'outfit-006-blazer-dress-charcoal',
    name: 'Charcoal Double-Breasted Blazer Dress',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Quiet Luxury & Edgy',
    styles: ['quiet_luxury', 'business_formal', 'edgy', 'classy'],
    occasion: 'party',
    occasions: ['party', 'office', 'interview'],
    weather: ['pleasant', 'cold'],
    season: 'Autumn/Winter',
    outfitType: 'blazer_dress',
    dress: 'Structured charcoal wool-blend double-breasted blazer dress with satin peak lapels',
    color: 'charcoal',
    colorFamily: 'dark',
    colors: ['charcoal', 'black', 'graphite', 'silver'],
    paletteMood: 'dark_moody',
    fit: 'fitted',
    silhouette: 'tailored',
    neckline: 'collared',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'inverted_triangle', 'rectangle'],
    comfort: 'balanced',
    formality: 'Formal',
    footwear: 'Black pointed stiletto ankle booties',
    bag: 'Sleek box clutch with silver clasp',
    jewellery: 'Architectural silver drop earrings',
    avatarUrl: '/avatars/business_chic.jpg',
    tags: ['Blazer Dress', 'Charcoal Power', 'Sharp Tailoring']
  }),
  createOutfit({
    id: 'outfit-007-ribbed-sweater-dress-mocha',
    name: 'Warm Dark Mocha Ribbed Knit Midi Dress',
    category: 'Western',
    subCategory: 'Dresses',
    style: 'Quiet Luxury & Cozy',
    styles: ['quiet_luxury', 'minimal', 'casual_vibe'],
    occasion: 'casual',
    occasions: ['casual', 'travel', 'college'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'sweater_dress',
    dress: 'Fine-gauge dark mocha merino ribbed knit turtleneck midi dress',
    color: 'dark_mocha',
    colorFamily: 'dark',
    colors: ['dark_mocha', 'espresso', 'camel', 'taupe'],
    paletteMood: 'warm_earthy',
    fit: 'regular',
    silhouette: 'column',
    neckline: 'mockneck',
    waistDefinition: 'semi-fitted',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'pear', 'oval'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Knee-high smooth leather riding boots in dark chocolate',
    bag: 'Slouchy buttery leather shoulder bag',
    jewellery: 'Chunky gold organic hoop earrings',
    avatarUrl: '/avatars/linen_coord.jpg',
    tags: ['Sweater Dress', 'Dark Mocha', 'Merino Knit', 'Knee Boots']
  }),

  // 2. TWO-PIECE & SEPARATES
  createOutfit({
    id: 'outfit-008-linen-overshirt-trousers',
    name: 'Sand Linen Overshirt & Wide-Leg Pants Set',
    category: 'Two-Piece & Separates',
    subCategory: 'Separates',
    style: 'Quiet Luxury & Resort',
    styles: ['quiet_luxury', 'minimal', 'resort_chic'],
    occasion: 'travel',
    occasions: ['travel', 'casual', 'beach'],
    weather: ['hot', 'warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'top_wide_leg',
    top: 'Notched lapel boxy linen overshirt in natural sand oatmeal',
    bottom: 'High-rise relaxed pleated wide-leg linen trousers with drawstring',
    color: 'beige',
    colorFamily: 'neutrals',
    colors: ['beige', 'camel', 'white', 'cream'],
    paletteMood: 'neutral',
    fit: 'relaxed',
    silhouette: 'oversized',
    neckline: 'collared',
    waistDefinition: 'high-waist',
    bodyShapeCompatibility: ['pear', 'oval', 'rectangle', 'inverted_triangle', 'hourglass'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Woven raffia and tan leather minimal flat slides',
    bag: 'Slouchy woven raffia tote with calfskin straps',
    jewellery: 'Gold dome earrings and tortoise sunglasses',
    avatarUrl: '/avatars/linen_coord.jpg',
    tags: ['Linen Co-ord', 'Quiet Luxury', 'Wide-Leg Pants', 'Airport Chic']
  }),
  createOutfit({
    id: 'outfit-009-blouse-wide-leg-navy',
    name: 'Midnight Navy Silk Blouse & Crepe Trousers',
    category: 'Two-Piece & Separates',
    subCategory: 'Separates',
    style: 'Old Money & Classic',
    styles: ['old_money', 'classy', 'professional', 'minimal_chic'],
    occasion: 'office',
    occasions: ['office', 'interview', 'date'],
    weather: ['pleasant', 'warm'],
    season: 'All Season',
    outfitType: 'blouse_wide_leg',
    top: 'Ivory silk crepe lavallière tie-neck blouse',
    bottom: 'Midnight navy pleated high-waisted wide-leg trousers with sharp center crease',
    color: 'navy',
    colorFamily: 'dark',
    colors: ['navy', 'midnight_blue', 'white', 'slate'],
    paletteMood: 'cool_sophisticated',
    fit: 'regular',
    silhouette: 'tailored',
    neckline: 'v-neck',
    waistDefinition: 'high-waist',
    bodyShapeCompatibility: ['pear', 'hourglass', 'inverted_triangle', 'rectangle'],
    comfort: 'balanced',
    formality: 'Business Casual',
    footwear: 'Pointed navy leather kitten heel slingbacks',
    bag: 'Structured burgundy leather satchel',
    jewellery: 'Single pearl drop pendant and link watch',
    avatarUrl: '/avatars/business_chic.jpg',
    tags: ['Silk Blouse', 'Midnight Navy', 'Wide-Leg Pants', 'Old Money']
  }),
  createOutfit({
    id: 'outfit-010-crop-top-high-waist-rust',
    name: 'Rust Knit Top & Off-White Tailored Pants',
    category: 'Two-Piece & Separates',
    subCategory: 'Separates',
    style: 'Modern & Trendy',
    styles: ['trendy', 'casual_vibe', 'clean_girl'],
    occasion: 'college',
    occasions: ['college', 'casual', 'date'],
    weather: ['warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'crop_top_high_waist',
    top: 'Fitted ribbed square-neck short-sleeve top in rich terracotta rust',
    bottom: 'High-waisted pleated tailored trousers in off-white ivory',
    color: 'rust',
    colorFamily: 'warm',
    colors: ['rust', 'terracotta', 'burnt_orange', 'off_white'],
    paletteMood: 'warm_earthy',
    fit: 'fitted',
    silhouette: 'tailored',
    neckline: 'square-neck',
    waistDefinition: 'high-waist',
    bodyShapeCompatibility: ['hourglass', 'pear', 'rectangle'],
    comfort: 'balanced',
    formality: 'Smart Casual',
    footwear: 'Pristine white leather tennis court sneakers',
    bag: 'Tan smooth leather baguette shoulder bag',
    jewellery: 'Layered gold chains and small thick hoops',
    avatarUrl: '/avatars/casual_chic.jpg',
    tags: ['Rust Knit', 'High-Waist Pants', 'Square Neck', 'Casual Polished']
  }),
  createOutfit({
    id: 'outfit-011-cardigan-skirt-lilac',
    name: 'Lilac Pearl Cardigan & Knife-Pleated Midi',
    category: 'Two-Piece & Separates',
    subCategory: 'Separates',
    style: 'Coquette & Soft Girl',
    styles: ['coquette', 'soft_girl', 'cute', 'feminine'],
    occasion: 'college',
    occasions: ['college', 'date', 'casual'],
    weather: ['pleasant', 'warm'],
    season: 'Spring/Autumn',
    outfitType: 'cardigan_skirt',
    top: 'Cropped soft fine-knit lilac cardigan with tonal pearl buttons',
    bottom: 'Cream ivory knife-pleated flowy midi skirt with fluid movement',
    color: 'lilac',
    colorFamily: 'pinks',
    colors: ['lilac', 'lavender', 'cream', 'rose_pink'],
    paletteMood: 'soft_pastel',
    fit: 'regular',
    silhouette: 'a-line',
    neckline: 'v-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['pear', 'hourglass', 'oval', 'rectangle'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Blush pink patent Mary Jane ballet flats with bow',
    bag: 'Pastel pink miniature structured crossbody bag',
    jewellery: 'Dainty gold stacking rings and silk hair ribbon',
    avatarUrl: '/avatars/skirt_cute.jpg',
    tags: ['Coquette', 'Pleated Midi', 'Lilac Cardigan', 'Ballet Flats']
  }),

  // 3. BUSINESS & PROFESSIONAL
  createOutfit({
    id: 'outfit-012-power-suit-plum',
    name: 'Royal Deep Plum Double-Breasted Power Suit',
    category: 'Business & Professional',
    subCategory: 'Suits',
    style: 'Business Formal & Luxury',
    styles: ['business_formal', 'professional', 'quiet_luxury', 'elegant'],
    occasion: 'office',
    occasions: ['office', 'interview', 'other'],
    weather: ['pleasant', 'cold'],
    season: 'Autumn/Winter',
    outfitType: 'blazer_trousers',
    top: 'Ivory silk camisole under structured deep plum double-breasted blazer',
    bottom: 'Deep plum pressed-crease wide-leg tailored trousers',
    color: 'deep_plum',
    colorFamily: 'dark',
    colors: ['deep_plum', 'eggplant', 'burgundy', 'white'],
    paletteMood: 'rich_luxurious',
    fit: 'fitted',
    silhouette: 'tailored',
    neckline: 'collared',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'inverted_triangle', 'rectangle', 'pear'],
    comfort: 'balanced',
    formality: 'Business Formal',
    footwear: 'Polished deep burgundy leather loafers with gold horsebit',
    bag: 'Rich cognac brown structured leather work briefcase tote',
    jewellery: 'Thick gold snake chain necklace and champagne watch',
    avatarUrl: '/avatars/business_chic.jpg',
    tags: ['Power Suit', 'Deep Plum', 'Business Formal', 'Executive Presence']
  }),
  createOutfit({
    id: 'outfit-013-blazer-pencil-skirt-charcoal',
    name: 'Tailored Charcoal Blazer & Sheath Pencil Skirt',
    category: 'Business & Professional',
    subCategory: 'Suits',
    style: 'Business Formal & Poised',
    styles: ['business_formal', 'professional', 'classy'],
    occasion: 'interview',
    occasions: ['interview', 'office'],
    weather: ['pleasant', 'cold'],
    season: 'All Season',
    outfitType: 'blazer_pencil_skirt',
    top: 'Fitted tailored single-breasted charcoal blazer over crisp white silk shirt',
    bottom: 'High-waisted tailored pencil skirt hitting just below the knee',
    color: 'charcoal',
    colorFamily: 'dark',
    colors: ['charcoal', 'graphite', 'slate', 'black'],
    paletteMood: 'dark_moody',
    fit: 'fitted',
    silhouette: 'column',
    neckline: 'collared',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'inverted_triangle'],
    comfort: 'style_first',
    formality: 'Business Formal',
    footwear: 'Pointed black leather court pumps with 3-inch heel',
    bag: 'Architectural black leather briefcase',
    jewellery: 'Minimalist solitaire pearl studs and link watch',
    avatarUrl: '/avatars/business_chic.jpg',
    tags: ['Pencil Skirt', 'Charcoal Tailoring', 'Interview Ready']
  }),
  createOutfit({
    id: 'outfit-014-waistcoat-trousers-camel',
    name: 'Tailored Camel Waistcoat & Pleated Slacks',
    category: 'Business & Professional',
    subCategory: 'Suits',
    style: 'Old Money & Smart Casual',
    styles: ['old_money', 'smart_casual', 'quiet_luxury'],
    occasion: 'office',
    occasions: ['office', 'casual', 'college'],
    weather: ['warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'waistcoat_trousers',
    top: 'Buttoned tailored waistcoat vest in warm camel wool-blend',
    bottom: 'Matching high-waisted double-pleated wide-leg trousers',
    color: 'camel',
    colorFamily: 'neutrals',
    colors: ['camel', 'chocolate_brown', 'cream', 'taupe'],
    paletteMood: 'warm_earthy',
    fit: 'regular',
    silhouette: 'tailored',
    neckline: 'v-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'pear', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Business Casual',
    footwear: 'Polished chocolate brown penny loafers',
    bag: 'Smooth tan leather top-handle satchel',
    jewellery: 'Vintage gold watch and signet ring',
    avatarUrl: '/avatars/business_chic.jpg',
    tags: ['Waistcoat Set', 'Camel Suit', 'Old Money Tailoring']
  }),

  // 4. ETHNIC & TRADITIONAL
  createOutfit({
    id: 'outfit-015-lavender-organza-saree',
    name: 'Pastel Lavender Organza Heritage Saree',
    category: 'Ethnic & Traditional',
    subCategory: 'Sarees',
    style: 'Modern Ethnic & Heritage',
    styles: ['traditional', 'festive', 'elegant', 'modern_ethnic'],
    occasion: 'wedding',
    occasions: ['wedding', 'festival', 'other'],
    weather: ['pleasant', 'warm', 'hot'],
    season: 'All Season',
    outfitType: 'organza_saree',
    top: 'Hand-embroidered raw silk blouse in deep dusty plum with gold zari',
    bottom: 'Pastel lavender handloom organza saree with scalloped gold border',
    color: 'lavender',
    colorFamily: 'pinks',
    colors: ['lavender', 'lilac', 'deep_plum', 'gold'],
    paletteMood: 'festive',
    fit: 'flowy',
    silhouette: 'flowy',
    neckline: 'sweetheart',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'pear', 'oval', 'rectangle', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Festive',
    footwear: 'Champagne gold embellished pearl juttis',
    bag: 'Velvet potli bag with pearl and zardozi embroidery',
    jewellery: 'Kundan and pearl choker set with chandbalis',
    avatarUrl: '/avatars/traditional_saree.jpg',
    tags: ['Organza Saree', 'Royal Lavender', 'Zari Work', 'Wedding Grandeur']
  }),
  createOutfit({
    id: 'outfit-016-kanjeevaram-ruby-gold-saree',
    name: 'Ruby Wine Kanjeevaram Silk Saree',
    category: 'Ethnic & Traditional',
    subCategory: 'Sarees',
    style: 'Royal Traditional & Opulent',
    styles: ['traditional', 'festive', 'classy'],
    occasion: 'wedding',
    occasions: ['wedding', 'festival'],
    weather: ['pleasant', 'cold'],
    season: 'Autumn/Winter',
    outfitType: 'silk_saree',
    top: 'Full-sleeve brocade blouse in antique gold with ruby red piping',
    bottom: 'Pure Kanjeevaram silk saree in deep ruby wine with heavy temple zari border',
    color: 'ruby_red',
    colorFamily: 'bold',
    colors: ['ruby_red', 'wine', 'gold', 'burgundy'],
    paletteMood: 'jewel_tones',
    fit: 'flowy',
    silhouette: 'flowy',
    neckline: 'boat-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'pear', 'oval', 'rectangle', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Festive',
    footwear: 'Gold metallic block heel sandals with ankle strap',
    bag: 'Antique gold metal minaudière clutch',
    jewellery: 'Heritage temple jewellery set with uncut rubies and jhumkas',
    avatarUrl: '/avatars/traditional_saree.jpg',
    tags: ['Kanjeevaram', 'Ruby Red', 'Temple Gold', 'Royal Heritage']
  }),
  createOutfit({
    id: 'outfit-017-chikankari-sage-kurti-palazzo',
    name: 'Sage Green Mulmul Chikankari Kurti Set',
    category: 'Ethnic & Traditional',
    subCategory: 'Kurtis',
    style: 'Modern Ethnic & Airy Comfort',
    styles: ['traditional', 'cute', 'minimal', 'indo_western'],
    occasion: 'college',
    occasions: ['college', 'casual', 'festival'],
    weather: ['hot', 'warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'kurti_palazzo',
    top: 'Pure mulmul cotton straight kurti in pastel sage green with white hand Chikankari',
    bottom: 'Airy ivory cotton-silk wide-leg palazzos with scalloped lace hem',
    color: 'green',
    colorFamily: 'neutrals',
    colors: ['green', 'mint', 'white', 'cream'],
    paletteMood: 'fresh_light',
    fit: 'relaxed',
    silhouette: 'a-line',
    neckline: 'mandarin',
    waistDefinition: 'straight',
    bodyShapeCompatibility: ['pear', 'oval', 'rectangle', 'hourglass', 'inverted_triangle'],
    comfort: 'comfort_first',
    formality: 'Smart Casual',
    footwear: 'Handcrafted silver pointed leather kolhapuris',
    bag: 'Artisanal jute and mirrorwork shoulder sling',
    jewellery: 'German silver oxidized jhumkas and filigree ring',
    avatarUrl: '/avatars/kurti_set.jpg',
    tags: ['Chikankari', 'Sage Green', 'Mulmul Kurti', 'Palazzo']
  }),
  createOutfit({
    id: 'outfit-018-anarkali-regal-midnight-blue',
    name: 'Midnight Blue Velvet Anarkali Suit',
    category: 'Ethnic & Traditional',
    subCategory: 'Anarkali',
    style: 'Royal Festive & Grandeur',
    styles: ['festive', 'traditional', 'glamorous'],
    occasion: 'wedding',
    occasions: ['wedding', 'festival', 'party'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'anarkali_suit',
    dress: 'Floor-length flared midnight blue velvet Anarkali with intricate zardozi yoke',
    bottom: 'Churidar pants in matching midnight blue',
    layer: 'Organza dupatta with heavy scalloped gold border',
    color: 'midnight_blue',
    colorFamily: 'dark',
    colors: ['midnight_blue', 'navy', 'gold', 'sapphire'],
    paletteMood: 'dark_moody',
    fit: 'flowy',
    silhouette: 'empire',
    neckline: 'sweetheart',
    waistDefinition: 'empire',
    bodyShapeCompatibility: ['oval', 'pear', 'hourglass', 'rectangle'],
    comfort: 'balanced',
    formality: 'Festive',
    footwear: 'Gold embroidered bridal juttis',
    bag: 'Velvet royal potli bag with seed pearls',
    jewellery: 'Polki and sapphire blue statement necklace set',
    avatarUrl: '/avatars/traditional_saree.jpg',
    tags: ['Anarkali', 'Midnight Velvet', 'Empire Flare', 'Wedding Royalty']
  }),
  createOutfit({
    id: 'outfit-019-sharara-mustard-festive',
    name: 'Mustard Raw Silk Tiered Sharara Set',
    category: 'Ethnic & Traditional',
    subCategory: 'Sharara',
    style: 'Vibrant Festive & Celebratory',
    styles: ['festive', 'traditional', 'statement_colors'],
    occasion: 'festival',
    occasions: ['festival', 'wedding'],
    weather: ['pleasant', 'warm'],
    season: 'All Season',
    outfitType: 'sharara_set',
    top: 'Short peplum raw silk kurti in vibrant mustard with gota patti work',
    bottom: 'Flared tiered sharara pants in matching mustard raw silk with mirror trim',
    color: 'mustard',
    colorFamily: 'warm',
    colors: ['mustard', 'golden_yellow', 'gold', 'terracotta'],
    paletteMood: 'statement_colors',
    fit: 'regular',
    silhouette: 'peplum',
    neckline: 'round-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['pear', 'hourglass', 'rectangle', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Festive',
    footwear: 'Embroidered mirrorwork juttis in gold',
    bag: 'Zardozi frame clutch with chain',
    jewellery: 'Meenakari chandbali earrings and maang tikka',
    avatarUrl: '/avatars/traditional_saree.jpg',
    tags: ['Sharara Set', 'Mustard Gold', 'Gota Patti', 'Festival']
  }),

  // 5. STREETWEAR
  createOutfit({
    id: 'outfit-020-streetwear-trench-cargos',
    name: 'Architectural Trench & Olive Utility Cargos',
    category: 'Streetwear',
    subCategory: 'Streetwear',
    style: 'Modern Streetwear & Edgy',
    styles: ['streetwear', 'edgy', 'trendy', 'model_off_duty'],
    occasion: 'casual',
    occasions: ['casual', 'travel', 'college'],
    weather: ['pleasant', 'cold', 'rainy'],
    season: 'Autumn/Winter',
    outfitType: 'top_wide_leg',
    top: 'Black ribbed mockneck fine knit under oversized sand storm-flap trench',
    bottom: 'Muted olive tailored wide-leg cargo pants with flap pockets',
    color: 'deep_olive',
    colorFamily: 'dark',
    colors: ['deep_olive', 'charcoal', 'black', 'beige'],
    paletteMood: 'dark_moody',
    fit: 'oversized',
    silhouette: 'oversized',
    neckline: 'mockneck',
    waistDefinition: 'straight',
    bodyShapeCompatibility: ['rectangle', 'inverted_triangle', 'pear', 'oval', 'hourglass'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Chunky designer technical runners in beige & black',
    bag: 'Black nylon multi-pocket utility crossbody bag',
    jewellery: 'Chunky silver chain-link necklace and signet ring',
    avatarUrl: '/avatars/street_trendy.jpg',
    tags: ['Streetwear', 'Trench Layering', 'Cargo Pants', 'Chunky Sneakers']
  }),
  createOutfit({
    id: 'outfit-021-graphic-tee-baggy-jeans',
    name: 'Oversized Graphic Tee & Vintage Baggy Denim',
    category: 'Streetwear',
    subCategory: 'Streetwear',
    style: '90s Skater & Retro Streetwear',
    styles: ['streetwear', 'y2k', 'casual_vibe', 'retro'],
    occasion: 'college',
    occasions: ['college', 'casual'],
    weather: ['warm', 'pleasant'],
    season: 'All Season',
    outfitType: 'jeans_top',
    top: 'Washed charcoal heavyweight boxy oversized graphic band tee',
    bottom: 'High-waisted vintage light-wash baggy wide-leg skater jeans',
    color: 'charcoal',
    colorFamily: 'dark',
    colors: ['charcoal', 'black', 'blue', 'grey'],
    paletteMood: 'vintage',
    fit: 'oversized',
    silhouette: 'oversized',
    neckline: 'crew-neck',
    waistDefinition: 'straight',
    bodyShapeCompatibility: ['rectangle', 'hourglass', 'pear', 'inverted_triangle'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Retro canvas high-top basketball sneakers in black & white',
    bag: 'Canvas aesthetic tote with utility keychains',
    jewellery: 'Layered stainless steel chain chokers',
    avatarUrl: '/avatars/street_trendy.jpg',
    tags: ['Graphic Tee', 'Baggy Jeans', '90s Skater', 'Streetwear']
  }),
  createOutfit({
    id: 'outfit-022-leather-jacket-straight-jeans',
    name: 'Oversized Leather Moto Jacket & Raw Denim',
    category: 'Streetwear',
    subCategory: 'Streetwear',
    style: 'Model-Off-Duty & Edgy',
    styles: ['model_off_duty', 'edgy', 'rock_inspired', 'streetwear'],
    occasion: 'casual',
    occasions: ['casual', 'party', 'date'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'leather_jacket_jeans',
    top: 'White baby tee under boxy distressed black leather motorcycle jacket',
    bottom: 'Dark raw indigo straight-leg denim with clean hem',
    color: 'jet_black',
    colorFamily: 'dark',
    colors: ['jet_black', 'black', 'white', 'silver'],
    paletteMood: 'high_contrast',
    fit: 'regular',
    silhouette: 'straight',
    neckline: 'crew-neck',
    waistDefinition: 'belted',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'inverted_triangle', 'pear'],
    comfort: 'balanced',
    formality: 'Casual',
    footwear: 'Black polished leather Chelsea boots with lug sole',
    bag: 'Black leather shoulder baguette with silver hardware',
    jewellery: 'Silver chunky hoop earrings and micro cat-eye sunglasses',
    avatarUrl: '/avatars/street_trendy.jpg',
    tags: ['Leather Jacket', 'Moto Chic', 'Model Off Duty', 'Raw Denim']
  }),

  // 6. ACTIVEWEAR & FITNESS / SPORTS & COMFORT
  createOutfit({
    id: 'outfit-023-seamless-workout-set-espresso',
    name: 'Espresso Ribbed Workout Set & Shrug',
    category: 'Activewear & Fitness',
    subCategory: 'Activewear',
    style: 'Clean Girl & Athleisure',
    styles: ['athleisure', 'clean_girl', 'sporty'],
    occasion: 'gym',
    occasions: ['gym', 'casual', 'travel'],
    weather: ['warm', 'pleasant'],
    season: 'All Season',
    outfitType: 'sports_bra_leggings',
    top: 'Butter-soft ribbed seamless sports bra with square neckline',
    bottom: 'High-waisted compression ankle-length training leggings in espresso',
    layer: 'Cropped long-sleeve bolero shrug in matching espresso',
    color: 'espresso',
    colorFamily: 'dark',
    colors: ['espresso', 'chocolate_brown', 'dark_mocha', 'cream'],
    paletteMood: 'warm_earthy',
    fit: 'fitted',
    silhouette: 'bodycon',
    neckline: 'square-neck',
    waistDefinition: 'high-waist',
    bodyShapeCompatibility: ['hourglass', 'rectangle', 'inverted_triangle', 'pear'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Cushioned high-performance neutral running shoes',
    bag: 'Quilted puffy gym duffel tote',
    jewellery: 'Waterproof dainty gold huggies',
    avatarUrl: '/avatars/casual_chic.jpg',
    tags: ['Activewear', 'Espresso Ribbed', 'Pilates Set', 'Athleisure']
  }),
  createOutfit({
    id: 'outfit-024-tennis-skirt-set-cream',
    name: 'Ivory Pleated Tennis Skirt & Performance Polo',
    category: 'Activewear & Fitness',
    subCategory: 'Activewear',
    style: 'Preppy & Sporty',
    styles: ['preppy', 'sporty', 'clean_girl'],
    occasion: 'gym',
    occasions: ['gym', 'casual', 'college'],
    weather: ['warm', 'hot'],
    season: 'Spring/Summer',
    outfitType: 'tennis_skirt_set',
    top: 'Breathable cropped pique polo shirt in crisp ivory with navy collar trim',
    bottom: 'High-waisted knife-pleated athletic tennis skirt with built-in liner shorts',
    color: 'cream',
    colorFamily: 'neutrals',
    colors: ['cream', 'white', 'navy', 'forest_green'],
    paletteMood: 'minimal_chic',
    fit: 'regular',
    silhouette: 'a-line',
    neckline: 'collared',
    waistDefinition: 'high-waist',
    bodyShapeCompatibility: ['pear', 'hourglass', 'rectangle'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Clean white tennis court sneakers with retro tube socks',
    bag: 'Structured canvas racquet tote bag',
    jewellery: 'Gold tennis bracelet and visor cap',
    avatarUrl: '/avatars/skirt_cute.jpg',
    tags: ['Tennis Skirt', 'Preppy Active', 'Ivory Polo', 'Court Chic']
  }),
  createOutfit({
    id: 'outfit-025-fleece-hoodie-joggers-charcoal',
    name: 'Heavyweight Charcoal Fleece Hoodie & Joggers',
    category: 'Sports & Comfort',
    subCategory: 'Lounge',
    style: 'Effortless Lounge & Airport Comfort',
    styles: ['sporty', 'casual_vibe', 'streetwear'],
    occasion: 'travel',
    occasions: ['travel', 'casual', 'gym'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'hoodie_joggers',
    top: 'Brushed organic fleece oversized pullover hoodie in deep charcoal',
    bottom: 'Relaxed cuffed tapered sweatpants joggers with hidden drawstring',
    color: 'charcoal',
    colorFamily: 'dark',
    colors: ['charcoal', 'slate', 'grey', 'black'],
    paletteMood: 'dark_moody',
    fit: 'oversized',
    silhouette: 'oversized',
    neckline: 'hooded',
    waistDefinition: 'elastic',
    bodyShapeCompatibility: ['oval', 'rectangle', 'pear', 'inverted_triangle', 'hourglass'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Slip-on shearling-lined suede platform mules',
    bag: 'Lightweight nylon travel duffel',
    jewellery: 'Small titanium studs',
    avatarUrl: '/avatars/street_trendy.jpg',
    tags: ['Hoodie & Joggers', 'Charcoal Fleece', 'Airport Travel', 'Cozy']
  }),

  // 7. BOHO & PREPPY
  createOutfit({
    id: 'outfit-026-boho-tiered-maxi-rust',
    name: 'Terracotta Tiered Paisley Boho Maxi Dress',
    category: 'Boho',
    subCategory: 'Dresses',
    style: 'Bohemian & Free Spirit',
    styles: ['boho', 'romantic', 'resort_chic'],
    occasion: 'casual',
    occasions: ['casual', 'beach', 'festival', 'travel'],
    weather: ['hot', 'warm', 'pleasant'],
    season: 'Spring/Summer',
    outfitType: 'boho_maxi_dress',
    dress: 'Flowy tiered paisley print maxi dress in rich terracotta with tasseled drawstring neckline',
    color: 'terracotta',
    colorFamily: 'warm',
    colors: ['terracotta', 'rust', 'mustard', 'cream'],
    paletteMood: 'warm_earthy',
    fit: 'flowy',
    silhouette: 'flowy',
    neckline: 'v-neck',
    waistDefinition: 'empire',
    bodyShapeCompatibility: ['oval', 'pear', 'hourglass', 'rectangle', 'inverted_triangle'],
    comfort: 'comfort_first',
    formality: 'Casual',
    footwear: 'Handcrafted lace-up tan leather gladiator sandals',
    bag: 'Suede fringe crossbody bag',
    jewellery: 'Layered turquoise beads, hammered gold cuffs and wide-brim fedora',
    avatarUrl: '/avatars/linen_coord.jpg',
    tags: ['Boho Maxi', 'Terracotta Paisley', 'Tiered Flow', 'Fringe Bag']
  }),
  createOutfit({
    id: 'outfit-027-preppy-sweater-vest-skirt',
    name: 'Cable Knit Sweater Vest & Pleated Mini Skirt',
    category: 'Preppy',
    subCategory: 'Separates',
    style: 'Collegiate Preppy & Clean',
    styles: ['preppy', 'light_academia', 'cute'],
    occasion: 'college',
    occasions: ['college', 'casual', 'office'],
    weather: ['pleasant', 'cold'],
    season: 'Autumn/Spring',
    outfitType: 'preppy_cardigan_skirt',
    top: 'Oversized cream cable-knit V-neck sweater vest over crisp light blue oxford shirt',
    bottom: 'High-waisted navy pleated wool-blend mini tennis skirt',
    color: 'navy',
    colorFamily: 'dark',
    colors: ['navy', 'baby_blue', 'cream', 'white'],
    paletteMood: 'cool_sophisticated',
    fit: 'regular',
    silhouette: 'a-line',
    neckline: 'v-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['pear', 'hourglass', 'rectangle'],
    comfort: 'balanced',
    formality: 'Smart Casual',
    footwear: 'Polished black leather penny loafers with sheer white crew socks',
    bag: 'Structured brown leather satchel with brass buckle',
    jewellery: 'Dainty pearl studs and tortoiseshell headband',
    avatarUrl: '/avatars/skirt_cute.jpg',
    tags: ['Preppy', 'Sweater Vest', 'Collegiate', 'Loafers']
  }),

  // 8. ALTERNATIVE & DARK ACADEMIA
  createOutfit({
    id: 'outfit-028-dark-academia-tweed-plaid',
    name: 'Dark Academia Tweed Blazer & Plaid Pleated Skirt',
    category: 'Alternative',
    subCategory: 'Separates',
    style: 'Dark Academia & Vintage Alternative',
    styles: ['dark_academia', 'vintage', 'alternative', 'edgy'],
    occasion: 'college',
    occasions: ['college', 'casual', 'office'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'cardigan_skirt',
    top: 'Black ribbed fine-knit turtleneck under tailored herringbone brown tweed blazer',
    bottom: 'High-waisted dark green and burgundy tartan wool pleated midi skirt',
    color: 'forest_green',
    colorFamily: 'dark',
    colors: ['forest_green', 'burgundy', 'chocolate_brown', 'black'],
    paletteMood: 'dark_moody',
    fit: 'regular',
    silhouette: 'tailored',
    neckline: 'mockneck',
    waistDefinition: 'belted',
    bodyShapeCompatibility: ['hourglass', 'pear', 'rectangle', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Smart Casual',
    footwear: 'Lace-up dark oxblood leather Oxford brogues',
    bag: 'Vintage structured leather book satchel',
    jewellery: 'Antique brass locket and round tortoiseshell reading glasses',
    avatarUrl: '/avatars/street_trendy.jpg',
    tags: ['Dark Academia', 'Tweed Blazer', 'Tartan Skirt', 'Oxford Shoes']
  }),
  createOutfit({
    id: 'outfit-029-gothic-velvet-lace-midi',
    name: 'Midnight Plum Gothic Velvet & Lace Midi',
    category: 'Alternative',
    subCategory: 'Dresses',
    style: 'Gothic & Dark Feminine',
    styles: ['gothic', 'dark_feminine', 'alternative', 'edgy'],
    occasion: 'party',
    occasions: ['party', 'date', 'other'],
    weather: ['cold', 'pleasant'],
    season: 'Autumn/Winter',
    outfitType: 'dress',
    dress: 'Crushed deep plum velvet square-neck midi dress with sheer black lace sleeves',
    color: 'deep_plum',
    colorFamily: 'dark',
    colors: ['deep_plum', 'jet_black', 'burgundy', 'silver'],
    paletteMood: 'dark_moody',
    fit: 'fitted',
    silhouette: 'a-line',
    neckline: 'square-neck',
    waistDefinition: 'cinched',
    bodyShapeCompatibility: ['hourglass', 'pear', 'rectangle', 'inverted_triangle'],
    comfort: 'balanced',
    formality: 'Semi-Formal',
    footwear: 'Chunky lace-up black leather combat boots with silver eyelets',
    bag: 'Black velvet heart-shaped crossbody bag',
    jewellery: 'Victorian black lace choker with garnet crystal drop',
    avatarUrl: '/avatars/party_glam.jpg',
    tags: ['Gothic Romance', 'Crushed Velvet', 'Dark Feminine', 'Lace Trim']
  })
];

// Dynamically generate remaining diverse combinations to exceed 100+ structured entries
const PALETTE_VARIATIONS = [
  { name: 'Sapphire & Cobalt', color: 'sapphire', colorFamily: 'bold', colors: ['sapphire', 'cobalt_blue', 'navy', 'silver'], paletteMood: 'jewel_tones' },
  { name: 'Merlot & Wine', color: 'merlot', colorFamily: 'dark', colors: ['merlot', 'wine', 'burgundy', 'gold'], paletteMood: 'dark_moody' },
  { name: 'Forest Green & Ivory', color: 'forest_green', colorFamily: 'dark', colors: ['forest_green', 'emerald', 'cream', 'gold'], paletteMood: 'rich_luxurious' },
  { name: 'Terracotta & Camel', color: 'terracotta', colorFamily: 'warm', colors: ['terracotta', 'camel', 'rust', 'beige'], paletteMood: 'warm_earthy' },
  { name: 'Midnight Jet Noir', color: 'jet_black', colorFamily: 'dark', colors: ['jet_black', 'deep_black', 'charcoal', 'white'], paletteMood: 'high_contrast' },
  { name: 'Lilac & Blush Pastels', color: 'lilac', colorFamily: 'pinks', colors: ['lilac', 'blush', 'pink', 'cream'], paletteMood: 'soft_pastel' },
  { name: 'Mustard & Earth Gold', color: 'mustard', colorFamily: 'warm', colors: ['mustard', 'golden_yellow', 'brown', 'terracotta'], paletteMood: 'statement_colors' },
  { name: 'Teal & Slate Modern', color: 'teal', colorFamily: 'bold', colors: ['teal', 'deep_teal', 'slate', 'silver'], paletteMood: 'cool_sophisticated' }
];

const SILHOUETTES_BY_BODY_SHAPE = {
  hourglass: [
    { type: 'wrap_dress', silhouette: 'wrap', waist: 'cinched', desc: 'Flattering wrap contour with cinched sash' },
    { type: 'bodycon_dress', silhouette: 'bodycon', waist: 'cinched', desc: 'Sculpted form-fitting silhouette celebrating curves' },
    { type: 'blazer_trousers', silhouette: 'tailored', waist: 'cinched', desc: 'Belted tailored blazer with wide-leg trousers' },
    { type: 'top_wide_leg', silhouette: 'tailored', waist: 'high-waist', desc: 'Fitted top tucked into high-waisted wide trousers' }
  ],
  pear: [
    { type: 'a_line_dress', silhouette: 'a-line', waist: 'belted', desc: 'Structured shoulder line with gracefully flared A-line drape' },
    { type: 'blazer_trousers', silhouette: 'tailored', waist: 'high-waist', desc: 'Statement shoulder blazer balancing relaxed wide trousers' },
    { type: 'kurti_palazzo', silhouette: 'a-line', waist: 'straight', desc: 'Airy straight-cut kurti with flowing palazzos' },
    { type: 'cardigan_skirt', silhouette: 'a-line', waist: 'cinched', desc: 'Cropped knit top with high-waisted accordion pleated skirt' }
  ],
  rectangle: [
    { type: 'crop_top_high_waist', silhouette: 'tailored', waist: 'belted', desc: 'Defined high-rise waistband creating graceful proportion' },
    { type: 'boho_maxi_dress', silhouette: 'flowy', waist: 'cinched', desc: 'Tiered maxi with smocked cinched waist' },
    { type: 'waistcoat_trousers', silhouette: 'tailored', waist: 'cinched', desc: 'Architectural waistcoat with pleated trousers' },
    { type: 'leather_jacket_jeans', silhouette: 'straight', waist: 'belted', desc: 'Boxy moto jacket layered over straight-leg denim' }
  ],
  inverted_triangle: [
    { type: 'top_wide_leg', silhouette: 'tailored', waist: 'high-waist', desc: 'Soft draped neckline balancing voluminous wide trousers' },
    { type: 'a_line_dress', silhouette: 'a-line', waist: 'cinched', desc: 'Flared skirt volume creating harmonious lower symmetry' },
    { type: 'pleated_dress', silhouette: 'flowy', waist: 'semi-fitted', desc: 'V-neck bodice with fluid accordion pleats' },
    { type: 'hoodie_cargo_pants', silhouette: 'oversized', waist: 'straight', desc: 'Relaxed hoodie with voluminous utility cargo pants' }
  ],
  oval: [
    { type: 'boho_maxi_dress', silhouette: 'flowy', waist: 'empire', desc: 'Ethereal fluid empire drape with vertical elongation' },
    { type: 'top_wide_leg', silhouette: 'oversized', waist: 'elastic', desc: 'Open structured overshirt over breathable wide-leg trousers' },
    { type: 'anarkali_suit', silhouette: 'empire', waist: 'empire', desc: 'Graceful floor-length flared Anarkali' },
    { type: 'hoodie_joggers', silhouette: 'oversized', waist: 'elastic', desc: 'Soft drape fleece set prioritizing unrestricted luxury' }
  ]
};

// Generate 80+ additional rich combinations
let idCounter = 30;
Object.entries(SILHOUETTES_BY_BODY_SHAPE).forEach(([targetShape, silList]) => {
  silList.forEach((silItem, silIdx) => {
    PALETTE_VARIATIONS.forEach((pal, palIdx) => {
      idCounter++;
      const id = `outfit-${String(idCounter).padStart(3, '0')}-${silItem.type}-${pal.color}`;
      const name = `${pal.name} ${silItem.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
      
      const avatars = [
        '/avatars/casual_chic.jpg',
        '/avatars/business_chic.jpg',
        '/avatars/elegant_dress.jpg',
        '/avatars/traditional_saree.jpg',
        '/avatars/linen_coord.jpg',
        '/avatars/street_trendy.jpg',
        '/avatars/kurti_set.jpg',
        '/avatars/skirt_cute.jpg',
        '/avatars/party_glam.jpg'
      ];
      const avatarUrl = avatars[(idCounter) % avatars.length];

      // Determine category based on outfitType
      let category = 'Western';
      if (silItem.type.includes('kurti') || silItem.type.includes('saree') || silItem.type.includes('anarkali') || silItem.type.includes('lehenga') || silItem.type.includes('sharara')) {
        category = 'Ethnic & Traditional';
      } else if (silItem.type.includes('blazer') || silItem.type.includes('waistcoat') || silItem.type.includes('suit') || silItem.type.includes('sheath')) {
        category = 'Business & Professional';
      } else if (silItem.type.includes('hoodie') || silItem.type.includes('sports') || silItem.type.includes('tennis') || silItem.type.includes('joggers')) {
        category = 'Activewear & Fitness';
      } else if (silItem.type.includes('cargo') || silItem.type.includes('graphic') || silItem.type.includes('leather')) {
        category = 'Streetwear';
      } else if (silItem.type.includes('boho')) {
        category = 'Boho';
      } else if (silItem.type.includes('coord') || silItem.type.includes('wide_leg') || silItem.type.includes('skirt')) {
        category = 'Two-Piece & Separates';
      }

      // Determine occasions
      let occasions = ['casual', 'college'];
      if (category === 'Business & Professional') occasions = ['office', 'interview', 'other'];
      if (category === 'Ethnic & Traditional') occasions = ['wedding', 'festival', 'other'];
      if (category === 'Activewear & Fitness') occasions = ['gym', 'casual', 'travel'];
      if (pal.paletteMood === 'night_out' || silItem.type === 'bodycon_dress') occasions = ['party', 'date', 'other'];

      // Assign body shape compatibility
      const compatibility = [targetShape];
      if (targetShape === 'hourglass') compatibility.push('rectangle', 'pear');
      if (targetShape === 'pear') compatibility.push('hourglass', 'oval');
      if (targetShape === 'rectangle') compatibility.push('hourglass', 'inverted_triangle');
      if (targetShape === 'inverted_triangle') compatibility.push('rectangle', 'hourglass');
      if (targetShape === 'oval') compatibility.push('pear', 'rectangle');

      MOCK_OUTFITS.push(createOutfit({
        id,
        name,
        category,
        subCategory: silItem.type,
        style: pal.paletteMood === 'dark_moody' ? 'Quiet Luxury & Edgy' : 'Refined & Effortless',
        styles: [pal.paletteMood === 'dark_moody' ? 'quiet_luxury' : 'minimal', 'classy', 'casual_vibe'],
        occasion: occasions[0],
        occasions,
        weather: ['pleasant', 'warm', 'cold'],
        season: 'All Season',
        outfitType: silItem.type,
        dress: silItem.type.includes('dress') ? name : null,
        top: !silItem.type.includes('dress') ? `${pal.name} tailored top piece` : null,
        bottom: !silItem.type.includes('dress') ? `Coordinated ${pal.color.replace('_', ' ')} trousers` : null,
        color: pal.color,
        colorFamily: pal.colorFamily,
        colors: pal.colors,
        paletteMood: pal.paletteMood,
        fit: silItem.silhouette === 'bodycon' ? 'fitted' : silItem.silhouette === 'oversized' ? 'oversized' : 'regular',
        silhouette: silItem.silhouette,
        neckline: 'v-neck',
        waistDefinition: silItem.waist,
        bodyShapeCompatibility: compatibility,
        comfort: silItem.silhouette === 'oversized' ? 'comfort_first' : 'balanced',
        formality: category === 'Business & Professional' ? 'Business Formal' : 'Casual',
        footwear: category === 'Business & Professional' ? 'Pointed leather loafers' : category === 'Activewear & Fitness' ? 'Running trainers' : 'Leather slingbacks',
        bag: 'Curated structured leather satchel',
        jewellery: 'Minimalist gold or silver accents',
        description: `Bespoke ${name} optimized for ${targetShape} silhouettes, emphasizing ${silItem.desc}.`,
        avatarUrl,
        tags: [category, pal.paletteMood.replace(/_/g, ' '), `${targetShape.toUpperCase()} Fit`]
      }));
    });
  });
});

/**
 * BODY-SHAPE-AWARE & NON-REPETITION RECOMMENDATION ENGINE
 * Considers Body Shape + Occasion + Style + Weather + Color + Fit + Comfort + Footwear + Exclusions
 * Tracks recentlyShownOutfits to ensure every click delivers fresh, non-repeating looks.
 */
export function getRecommendedOutfits(preferences = {}, count = 3, seedOffset = 0, excludedIds = []) {
  if (!preferences) preferences = {};

  // Retrieve shown history from localStorage if available
  let shownIds = new Set(excludedIds);
  try {
    const storedHistory = localStorage.getItem('chic_genie_shown_outfits');
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => shownIds.add(id));
      }
    }
  } catch (e) {}

  const userBodyShape = (preferences.bodyShape || '').toLowerCase().trim();

  // Score all available catalog items
  const scored = MOCK_OUTFITS.map((outfit) => {
    let score = 50; // baseline

    // 1. BODY SHAPE COMPATIBILITY (High-Weight Personalization)
    if (userBodyShape && userBodyShape !== '') {
      const compatList = outfit.bodyShapeCompatibility.map(s => s.toLowerCase());
      if (compatList.includes(userBodyShape)) {
        score += 24; // Big boost for direct compatibility
      } else {
        score -= 8; // Gentle deprioritization, not complete exclusion
      }

      // Additional tailored silhouette bonuses
      if (userBodyShape === 'hourglass' && (outfit.waistDefinition === 'cinched' || outfit.silhouette === 'wrap')) score += 6;
      if (userBodyShape === 'pear' && (outfit.silhouette === 'a-line' || outfit.outfitType.includes('wide_leg'))) score += 6;
      if (userBodyShape === 'rectangle' && (outfit.waistDefinition === 'belted' || outfit.silhouette === 'tailored')) score += 6;
      if (userBodyShape === 'inverted_triangle' && (outfit.outfitType.includes('wide_leg') || outfit.silhouette === 'a-line')) score += 6;
      if (userBodyShape === 'oval' && (outfit.silhouette === 'flowy' || outfit.waistDefinition === 'empire' || outfit.fit === 'relaxed')) score += 6;
    }

    // 2. OCCASION MATCH
    if (preferences.occasion) {
      if (outfit.occasions.includes(preferences.occasion) || outfit.occasion === preferences.occasion) {
        score += 18;
      }
    }

    // 3. STYLE MATCH
    if (preferences.styles && preferences.styles.length > 0) {
      const matchCount = preferences.styles.filter(s => 
        outfit.styles.includes(s) || 
        outfit.style.toLowerCase().includes(s.toLowerCase())
      ).length;
      score += Math.min(16, matchCount * 6);
    }

    // 4. OUTFIT TYPE MATCH
    if (preferences.outfitType && preferences.outfitType !== 'surprise_me') {
      if (outfit.outfitType === preferences.outfitType || outfit.subCategory === preferences.outfitType) {
        score += 18;
      } else if (preferences.outfitType.includes('dress') && outfit.outfitType.includes('dress')) {
        score += 10;
      } else if (preferences.outfitType.includes('saree') && outfit.outfitType.includes('saree')) {
        score += 10;
      }
    }

    // 5. COLOR & PALETTE MATCH
    if (preferences.colors && preferences.colors.length > 0) {
      if (preferences.colors.includes('any')) {
        score += 4;
      } else {
        const colorOverlap = preferences.colors.filter(c => 
          outfit.colors.includes(c) || 
          outfit.color === c || 
          outfit.colorFamily === c
        ).length;
        score += Math.min(12, colorOverlap * 5);
      }
    }

    if (preferences.palette && preferences.palette !== 'no_preference') {
      if (outfit.palette === preferences.palette || outfit.paletteMood === preferences.palette) {
        score += 8;
      }
    }

    // 6. WEATHER MATCH
    if (preferences.weather) {
      if (Array.isArray(outfit.weather) ? outfit.weather.includes(preferences.weather) : outfit.weather === preferences.weather) {
        score += 6;
      }
    }

    // 7. FIT & COMFORT MATCH
    if (preferences.fit && outfit.fit === preferences.fit) score += 5;
    if (preferences.comfort && outfit.comfort === preferences.comfort) score += 5;

    // 8. FOOTWEAR MATCH
    if (preferences.footwear && preferences.footwear !== 'any') {
      if (outfit.footwear.toLowerCase().includes(preferences.footwear.replace(/_/g, ' '))) {
        score += 6;
      }
    }

    // 9. EXCLUSIONS PENALTY
    if (preferences.avoid && preferences.avoid.length > 0) {
      if (preferences.avoid.includes('no_heels') && (outfit.footwear.toLowerCase().includes('heel') || outfit.footwear.toLowerCase().includes('stiletto'))) {
        score -= 30;
      }
      if (preferences.avoid.includes('no_jeans') && ((outfit.bottom && outfit.bottom.toLowerCase().includes('denim')) || outfit.outfitType.includes('jeans'))) {
        score -= 30;
      }
      if (preferences.avoid.includes('no_traditional') && (outfit.category.includes('Ethnic') || outfit.outfitType.includes('saree') || outfit.outfitType.includes('kurti'))) {
        score -= 35;
      }
      if (preferences.avoid.includes('no_oversized') && outfit.fit === 'oversized') {
        score -= 25;
      }
    }

    // 10. RECENT NOVELTY / SHOWN HISTORY PENALTY (Prevents exact repeats)
    const isRecentlyShown = shownIds.has(outfit.id);
    if (isRecentlyShown) {
      score -= 40; // Deprioritize recently viewed items
    }

    // Normalize match score to a realistic luxury percentage (88% - 99%)
    const normalizedScore = Math.min(99, Math.max(88, Math.round(score * 0.95) + ((outfit.name.length * 3) % 4)));

    return {
      ...outfit,
      preferenceMatch: normalizedScore,
      isRecentlyShown
    };
  });

  // Sort descending by calculated match score
  scored.sort((a, b) => b.preferenceMatch - a.preferenceMatch);

  // Divide into fresh (unseen) and fallback pools
  const unseenPool = scored.filter(o => !o.isRecentlyShown);
  let candidatePool = unseenPool.length >= count ? unseenPool : scored;

  // DIVERSITY SELECTION: Ensure 3 picks differ in silhouette/category
  const selected = [];
  const chosenCategories = new Set();
  const chosenTypes = new Set();

  for (const candidate of candidatePool) {
    if (selected.length >= count) break;
    
    // Attempt to pick different outfit types
    const typeKey = candidate.outfitType;
    if (selected.length === 0 || !chosenTypes.has(typeKey) || candidatePool.length < count * 2) {
      selected.push(candidate);
      chosenTypes.add(typeKey);
      chosenCategories.add(candidate.category);
    }
  }

  // If diversity filter was too strict, fill remaining slots
  if (selected.length < count) {
    for (const candidate of candidatePool) {
      if (selected.length >= count) break;
      if (!selected.some(s => s.id === candidate.id)) {
        selected.push(candidate);
      }
    }
  }

  // Update history in localStorage (store up to last 40 IDs)
  try {
    const newShown = Array.from(new Set([...selected.map(s => s.id), ...Array.from(shownIds)])).slice(0, 45);
    localStorage.setItem('chic_genie_shown_outfits', JSON.stringify(newShown));
  } catch (e) {}

  return selected;
}
