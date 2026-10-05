'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from './ui';

interface ProjectFilterProps {
  categories: string[];
  academicYears: number[];
}

export function ProjectFilter({ categories, academicYears }: ProjectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');

  const handleFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category) params.set('category', category);
    if (year) params.set('year', year);

    startTransition(() => {
      router.push(`/showcase?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('');
    setYear('');
    startTransition(() => {
      router.push('/showcase');
    });
  };

  return (
    <form
      onSubmit={handleFilter}
      className={`${cardClass} p-6 shadow-sm mb-8`}
      role="search"
      aria-label="ค้นหาและกรองโปรเจกต์"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ค้นหาจากคำสำคัญ */}
        <div className="md:col-span-2">
          <label htmlFor="keyword" className="block text-label-md font-semibold text-on-surface mb-1">
            ค้นหา (ชื่อผลงาน, คำสำคัญ, Tech Stack)
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="เช่น AI, IoT, Next.js, ภาษาไทย..."
            className={inputClass}
          />
        </div>

        {/* หมวดหมู่ */}
        <div>
          <label htmlFor="category" className="block text-label-md font-semibold text-on-surface mb-1">
            หมวดหมู่
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">ทั้งหมด</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ปีการศึกษา */}
        <div>
          <label htmlFor="year" className="block text-label-md font-semibold text-on-surface mb-1">
            ปีการศึกษา (พ.ศ.)
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputClass}
          >
            <option value="">ทุกปีการศึกษา</option>
            {academicYears.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className={secondaryButtonClass}
        >
          ล้างตัวกรอง
        </button>

        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClass}
        >
          {isPending ? 'กำลังค้นหา...' : 'ค้นหาผลงาน'}
        </button>
      </div>
    </form>
  );
}