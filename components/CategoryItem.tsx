// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col rounded-[34px] items-center gap-y-2 cursor-pointer bg-secondary border-2 border-secondary py-5 text-tertiary hover:bg-tertiary hover:text-secondary active:animate-pop">
        {children}

        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
