export const IMGS = {
  necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  ],
  ring: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=600&q=80',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80',
  ],
  bracelet: [
    'https://images.unsplash.com/photo-1573408301185-9519f94816e5?w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    'https://images.unsplash.com/photo-1614613535308-eb5fbd847f5a?w=600&q=80',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80',
  ],
  earring: [
    'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
    'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  ],
  model: [
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80',
  ]
};

const m = IMGS.model;

export const jewelryProducts = [
  { id:1,  name:'Diamond Solitaire Ring',     price:'Rs. 245,000', category:'Rings',    img:IMGS.ring[0],     modelImg:m[0], material:'18K White Gold' },
  { id:2,  name:'Pearl Strand Necklace',      price:'Rs. 185,000', category:'Necklaces',img:IMGS.necklace[0], modelImg:m[1], material:'Sterling Silver' },
  { id:3,  name:'Sapphire Tennis Bracelet',   price:'Rs. 320,000', category:'Bracelets',img:IMGS.bracelet[0], modelImg:m[2], material:'18K Gold' },
  { id:4,  name:'Diamond Drop Earrings',      price:'Rs. 195,000', category:'Earrings', img:IMGS.earring[0],  modelImg:m[3], material:'Platinum' },
  { id:5,  name:'Emerald Cocktail Ring',      price:'Rs. 410,000', category:'Rings',    img:IMGS.ring[1],     modelImg:m[4], material:'18K Yellow Gold' },
  { id:6,  name:'Gold Bangle Bracelet',       price:'Rs. 155,000', category:'Bracelets',img:IMGS.bracelet[1], modelImg:m[5], material:'18K Gold' },
  { id:7,  name:'Ruby Pendant Necklace',      price:'Rs. 278,000', category:'Necklaces',img:IMGS.necklace[1], modelImg:m[0], material:'18K Rose Gold' },
  { id:8,  name:'Diamond Hoop Earrings',      price:'Rs. 228,000', category:'Earrings', img:IMGS.earring[1],  modelImg:m[1], material:'18K White Gold' },
  { id:9,  name:'Platinum Wedding Band',      price:'Rs. 125,000', category:'Rings',    img:IMGS.ring[2],     modelImg:m[2], material:'Platinum' },
  { id:10, name:'Diamond Choker',             price:'Rs. 568,000', category:'Necklaces',img:IMGS.necklace[2], modelImg:m[3], material:'18K White Gold' },
  { id:11, name:'Pearl Drop Earrings',        price:'Rs. 98,000',  category:'Earrings', img:IMGS.earring[2],  modelImg:m[4], material:'Sterling Silver' },
  { id:12, name:'Charm Bracelet',             price:'Rs. 145,000', category:'Bracelets',img:IMGS.bracelet[2], modelImg:m[5], material:'18K Gold' },
  { id:13, name:'Amethyst Statement Ring',    price:'Rs. 185,000', category:'Rings',    img:IMGS.ring[3],     modelImg:m[0], material:'Sterling Silver' },
  { id:14, name:'Gold Chain Necklace',        price:'Rs. 210,000', category:'Necklaces',img:IMGS.necklace[3], modelImg:m[1], material:'18K Gold' },
  { id:15, name:'Crystal Stud Earrings',      price:'Rs. 75,000',  category:'Earrings', img:IMGS.earring[3],  modelImg:m[2], material:'Sterling Silver' },
  { id:16, name:'Tennis Bracelet Diamond',    price:'Rs. 445,000', category:'Bracelets',img:IMGS.bracelet[3], modelImg:m[3], material:'18K White Gold' },
  { id:17, name:'Blue Topaz Pendant',         price:'Rs. 165,000', category:'Necklaces',img:IMGS.necklace[0], modelImg:m[4], material:'18K White Gold' },
  { id:18, name:'Stackable Ring Set',         price:'Rs. 195,000', category:'Rings',    img:IMGS.ring[0],     modelImg:m[5], material:'Mixed Metal' },
  { id:19, name:'Chandelier Earrings',        price:'Rs. 285,000', category:'Earrings', img:IMGS.earring[0],  modelImg:m[0], material:'18K Rose Gold' },
  { id:20, name:'Layered Gold Necklace',      price:'Rs. 235,000', category:'Necklaces',img:IMGS.necklace[1], modelImg:m[1], material:'18K Gold' },
];

export const watchProducts = [
  { id:1, name:'Atlas Watch 24mm',        price:'Rs. 370,000', description:'Swiss-crafted luxury timepiece with precision movement.',               img:IMGS.watch[0], modelImg:m[2] },
  { id:2, name:'Tiffany Blue Dial Watch', price:'Rs. 420,000', description:'Elegant stainless-steel with signature blue dial.',                     img:IMGS.watch[1], modelImg:m[3] },
  { id:3, name:'Heritage Gold Watch',     price:'Rs. 510,000', description:'Premium gold-tone with sapphire crystal glass.',                        img:IMGS.watch[2], modelImg:m[4] },
  { id:4, name:'Unique Square Watch',     price:'Rs. 370,000', description:'27mm steel with iconic blue dial and Swiss movement.',                   img:IMGS.watch[3], modelImg:m[5] },
  { id:5, name:'Perpetual Diamond',       price:'Rs. 680,000', description:'Diamond-set bezel with mother of pearl dial.',                          img:IMGS.watch[0], modelImg:m[0] },
  { id:6, name:'Classic Oval Watch',      price:'Rs. 295,000', description:'Timeless oval case with Roman numeral markers.',                        img:IMGS.watch[1], modelImg:m[1] },
  { id:7, name:'Chronograph Elite',       price:'Rs. 520,000', description:'Multi-function chronograph with leather strap.',                        img:IMGS.watch[2], modelImg:m[2] },
  { id:8, name:'Rose Gold Petite',        price:'Rs. 445,000', description:'Feminine rose gold with diamond hour markers.',                         img:IMGS.watch[3], modelImg:m[3] },
];

export const engagementRings = [
  { id:1, name:'Sixteen Stone™ Ring',   price:'Rs. 890,000',   img:IMGS.ring[0], modelImg:m[0] },
  { id:2, name:'The Lumière Setting',   price:'Rs. 1,250,000', img:IMGS.ring[1], modelImg:m[1] },
  { id:3, name:'Lumière True®',         price:'Rs. 980,000',   img:IMGS.ring[2], modelImg:m[2] },
  { id:4, name:'Lumière Novo®',         price:'Rs. 1,100,000', img:IMGS.ring[3], modelImg:m[3] },
  { id:5, name:'Lumière Soleste®',      price:'Rs. 1,380,000', img:IMGS.ring[0], modelImg:m[4] },
];

export const weddingBands = [
  { id:1, name:'Eternity Diamond Band',  price:'Rs. 650,000', img:IMGS.ring[0], modelImg:m[0] },
  { id:2, name:'Gold Wedding Band',      price:'Rs. 320,000', img:IMGS.ring[1], modelImg:m[1] },
  { id:3, name:'Platinum Milgrain Band', price:'Rs. 480,000', img:IMGS.ring[2], modelImg:m[2] },
  { id:4, name:'Rose Gold Ring',         price:'Rs. 395,000', img:IMGS.ring[3], modelImg:m[3] },
  { id:5, name:'Pavé Diamond Band',      price:'Rs. 720,000', img:IMGS.ring[0], modelImg:m[4] },
  { id:6, name:'Classic Satin Band',     price:'Rs. 285,000', img:IMGS.ring[1], modelImg:m[5] },
];

export const accessoryProducts = [
  { id:1,  name:'Crystal Sunglasses',      price:'Rs. 45,000',  category:'Eyewear',  img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80', modelImg:m[0] },
  { id:2,  name:'Pearl Hair Pin Set',       price:'Rs. 18,000',  category:'Hair',     img:IMGS.necklace[0], modelImg:m[1] },
  { id:3,  name:'Luxury Watch Strap',       price:'Rs. 22,000',  category:'Watches',  img:IMGS.watch[0],    modelImg:m[2] },
  { id:4,  name:'Gold Charm Bracelet',      price:'Rs. 88,000',  category:'Bracelets',img:IMGS.bracelet[0], modelImg:m[3] },
  { id:5,  name:'Diamanté Belt',            price:'Rs. 55,000',  category:'Belts',    img:IMGS.bracelet[1], modelImg:m[4] },
  { id:6,  name:'Brooch Collection',        price:'Rs. 65,000',  category:'Brooches', img:IMGS.earring[0],  modelImg:m[5] },
  { id:7,  name:'Jade Stone Bracelet',      price:'Rs. 88,000',  category:'Bracelets',img:IMGS.bracelet[2], modelImg:m[0] },
  { id:8,  name:'Aviator Frames',           price:'Rs. 38,000',  category:'Eyewear',  img:'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80', modelImg:m[1] },
  { id:9,  name:'Statement Ring Gold',      price:'Rs. 125,000', category:'Rings',    img:IMGS.ring[2],     modelImg:m[2] },
  { id:10, name:'Diamond Hairband',         price:'Rs. 95,000',  category:'Hair',     img:IMGS.necklace[1], modelImg:m[3] },
  { id:11, name:'Crystal Necklace',         price:'Rs. 145,000', category:'Necklaces',img:IMGS.necklace[2], modelImg:m[4] },
  { id:12, name:'Drop Earring Set',         price:'Rs. 75,000',  category:'Earrings', img:IMGS.earring[1],  modelImg:m[5] },
];

export const giftProducts = [
  { id:1, name:'Gift Set — Necklace & Earrings', price:'Rs. 285,000', img:IMGS.necklace[0], modelImg:m[0] },
  { id:2, name:'Blue Box Bracelet Set',           price:'Rs. 195,000', img:IMGS.bracelet[0], modelImg:m[1] },
  { id:3, name:'Love Ring Duo',                   price:'Rs. 320,000', img:IMGS.ring[0],     modelImg:m[2] },
  { id:4, name:'Signature Pearl Set',             price:'Rs. 245,000', img:IMGS.necklace[1], modelImg:m[3] },
  { id:5, name:'Diamond Initial Pendant',         price:'Rs. 175,000', img:IMGS.necklace[2], modelImg:m[4] },
  { id:6, name:'Anniversary Eternity Band',       price:'Rs. 410,000', img:IMGS.ring[1],     modelImg:m[5] },
  { id:7, name:'Charm Bracelet Gift',             price:'Rs. 145,000', img:IMGS.bracelet[1], modelImg:m[0] },
  { id:8, name:'Crystal Earring Set',             price:'Rs. 98,000',  img:IMGS.earring[0],  modelImg:m[1] },
];
