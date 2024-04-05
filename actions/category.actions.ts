"use server";

import { db } from "@/lib/db";
import { handleError } from "@/lib/utils";

export const createCategory = async ({
  categoryName,
}: {
  categoryName: string;
}) => {
  try {
    const newCategory = await db.category.create({
      data: {
        name: categoryName,
      },
    });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
