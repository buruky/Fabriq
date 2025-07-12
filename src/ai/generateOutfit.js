// src/ai/generateOutfit.js
import OpenAI from 'openai';

/* ------------------ CONFIG / OPENAI CLIENT ------------------ */
const apiKey =
  process.env.REACT_APP_OPENAI_API_KEY ||   // CRA
  import.meta.env?.VITE_OPENAI_API_KEY ||   // Vite
  null;

const openai =
  apiKey &&
  new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // browser demo only
  });

/* ------------------ PREFERRED CLOTHING ORDER ---------------- */
const preferredOrder = ['Jackets', 'Shirts', 'Pants', 'Shorts', 'Shoes'];

/* ------------------ MAIN PUBLIC FUNCTION -------------------- */
export async function generateOutfit(imageFile, prompt, wardrobe) {
  const imgData = await fileToDataURL(imageFile);

  if (openai) {
    try {
      const caption = await describeImage(imgData);
      let recommended = await suggestItems(wardrobe, caption, prompt);

      // 🔒 Safety net: sort items client-side by preferredOrder
      recommended = sortByPreferredOrder(recommended);

      return { inspirationImage: imgData, prompt, recommendedItems: recommended };
    } catch (err) {
      console.error('OpenAI error — fallback to random:', err);
    }
  } else {
    console.warn('No OpenAI key — using random outfit fallback.');
  }

  // Fallback: random 3 items, then sort
  const fallback = sortByPreferredOrder(
    wardrobe.slice().sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  return { inspirationImage: imgData, prompt, recommendedItems: fallback };
}

/* ------------------ HELPER FUNCTIONS ------------------------ */

// Vision caption
async function describeImage(base64Image) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: base64Image } },
          { type: 'text', text: 'Describe this outfit describing the top bottom and shoes in seperate sentences.' },
        ],
      },
    ],
  });
  return res.choices[0].message.content.trim();
}

// Chat select items
async function suggestItems(wardrobe, caption, prompt) {
  const wardrobeJSON = JSON.stringify(wardrobe);

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'You are a virtual stylist. From the user wardrobe JSON choose ' +
          '**one TOP (Jackets or Shirts), one BOTTOM (Pants or Shorts), and one pair of SHOES**.' +
          'Return them in that exact order as a JSON array of objects you copied from the wardrobe.',
      },
      {
        role: 'user',
        content:
          `Wardrobe JSON:\n${wardrobeJSON}\n\n` +
          `Image Caption: "${caption}"\n` +
          `User Prompt: "${prompt}"\n\n` +
          'Return ONLY the JSON array.',
      },
    ],
  });

  const raw = res.choices?.[0]?.message?.content?.trim();
  console.log('%c🤖 GPT raw response:', 'color:purple', raw);

  let items;
  try {
    items = JSON.parse(raw);
  } catch {
    console.warn('AI response parse failed — falling back.');
    items = [];
  }

  /** ---------- Safety net: enforce exactly TOP + BOTTOM + SHOES ---------- */
  return forceTopBottomShoes(items, wardrobe);
}

function forceTopBottomShoes(items, wardrobe) {
  const isTop    = (t) => ['Jackets', 'Shirts'].includes(t);
  const isBottom = (t) => ['Pants', 'Shorts'].includes(t);
  const isShoes  = (t) => t === 'Shoes';

  const used = new Set();

  const pickUnique = (filterFn) => {
    const idx = wardrobe.findIndex((w, i) => filterFn(w.type) && !used.has(i));
    if (idx === -1) return { type: 'Other', alt: 'No match', src: '' };
    used.add(idx);
    return wardrobe[idx];
  };

  const distinctAI = [];
  const seenTypes = new Set();
  for (const itm of items) {
    if (!seenTypes.has(itm.type)) {
      distinctAI.push(itm);
      seenTypes.add(itm.type);
    }
  }

  const topAI    = distinctAI.find((i) => isTop(i.type));
  const bottomAI = distinctAI.find((i) => isBottom(i.type));
  const shoesAI  = distinctAI.find((i) => isShoes(i.type));

  [topAI, bottomAI, shoesAI].forEach((itm) => {
    if (!itm) return;
    const idx = wardrobe.findIndex((w) => w.src === itm.src && w.type === itm.type);
    if (idx !== -1) used.add(idx);
  });

  const top    = topAI    || pickUnique(isTop);
  const bottom = bottomAI || pickUnique(isBottom);
  const shoes  = shoesAI  || pickUnique(isShoes);

  return [top, bottom, shoes];
}

function sortByPreferredOrder(items) {
  return [...items].sort(
    (a, b) =>
      preferredOrder.indexOf(a.type ?? 'Other') -
      preferredOrder.indexOf(b.type ?? 'Other')
  );
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
