// src/util/storage.js
import { get, set, update } from 'idb-keyval';

export const getWardrobe = async (username) => {
  const data = await get(`wardrobe_${username}`);
  return data || [];
};

export const addToWardrobe = async (username, newItem) => {
  await update(`wardrobe_${username}`, (items = []) => [...items, newItem]);
};

export const setWardrobe = async (username, fullList) => {
  await set(`wardrobe_${username}`, fullList);
};

export const deleteItemFromWardrobe = async (username, indexToDelete) => {
  await update(`wardrobe_${username}`, (items = []) =>
    items.filter((_, i) => i !== indexToDelete)
  );
};

export const updateItemInWardrobe = async (username, indexToUpdate, updatedItem) => {
  await update(`wardrobe_${username}`, (items = []) =>
    items.map((item, i) => (i === indexToUpdate ? updatedItem : item))
  );
};

