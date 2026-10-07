export interface DuplicateCheckResult {
  isDuplicate: boolean;
  score: number; // 0 ถึง 100%
  matchedProjectId?: string;
  matchedTitle?: string;
}

/**
 * แปลงข้อความเป็นชุด 2 ตัวอักษร (Bigrams) สำหรับเทียบความคล้ายคลึง
 */
function getBigrams(str: string): Set<string> {
  const cleanStr = str.toLowerCase().replace(/\s+/g, '');
  const bigrams = new Set<string>();
  for (let i = 0; i < cleanStr.length - 1; i++) {
    bigrams.add(cleanStr.substring(i, i + 2));
  }
  return bigrams;
}

/**
 * คำนวณความคล้ายคลึงด้วย Dice's Coefficient (0.0 - 1.0)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (str1.trim() === str2.trim()) return 1.0;
  if (str1.length < 2 || str2.length < 2) return 0.0;

  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);

  let intersection = 0;
  for (const item of bigrams1) {
    if (bigrams2.has(item)) {
      intersection++;
    }
  }

  return (2.0 * intersection) / (bigrams1.size + bigrams2.size);
}

/**
 * ตรวจสอบชื่อกับรายการโครงงานเดิมทั้งหมด
 * เกณฑ์: ความคล้ายคลึง >= 75% ถือว่าเสี่ยงซ้ำซ้อนสูง
 */
export function checkDuplicateTitle(
  newTitle: string,
  existingProjects: { id: string; titleTh: string; titleEn: string }[],
  threshold = 0.75
): DuplicateCheckResult {
  let highestScore = 0;
  let matchedProject: { id: string; title: string } | undefined;

  for (const project of existingProjects) {
    const scoreTh = calculateSimilarity(newTitle, project.titleTh);
    const scoreEn = calculateSimilarity(newTitle, project.titleEn);
    const maxScore = Math.max(scoreTh, scoreEn);

    if (maxScore > highestScore) {
      highestScore = maxScore;
      matchedProject = {
        id: project.id,
        title: scoreTh >= scoreEn ? project.titleTh : project.titleEn,
      };
    }
  }

  const percentage = Math.round(highestScore * 100);

  return {
    isDuplicate: highestScore >= threshold,
    score: percentage,
    matchedProjectId: matchedProject?.id,
    matchedTitle: matchedProject?.title,
  };
}