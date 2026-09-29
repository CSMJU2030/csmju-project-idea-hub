import { CreateProjectInput } from '../types/domain';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export function validateProjectInput(input: CreateProjectInput): ValidationResult {
  const errors: Record<string, string[]> = {};

  const addError = (field: string, msg: string) => {
    if (!errors[field]) errors[field] = [];
    errors[field].push(msg);
  };

  if (!input.titleTh || input.titleTh.trim().length < 5) {
    addError('titleTh', 'ชื่อโครงงานภาษาไทยต้องมีความยาวอย่างน้อย 5 ตัวอักษร');
  }

  if (!input.titleEn || input.titleEn.trim().length < 5) {
    addError('titleEn', 'ชื่อโครงงานภาษาอังกฤษต้องมีความยาวอย่างน้อย 5 ตัวอักษร');
  }

  if (!input.abstract || input.abstract.trim().length < 20) {
    addError('abstract', 'บทคัดย่อต้องมีความยาวอย่างน้อย 20 ตัวอักษร');
  }

  if (!input.academicYear || input.academicYear < 2560 || input.academicYear > 2580) {
    addError('academicYear', 'ปีการศึกษาต้องระบุเป็น พ.ศ. ที่ถูกต้อง');
  }

  if (!input.category || input.category.trim() === '') {
    addError('category', 'กรุณาระบุหมวดหมู่ผลงาน');
  }

  if (!input.members || input.members.length < 1) {
    addError('members', 'ต้องระบุสมาชิกผู้จัดทำอย่างน้อย 1 คน');
  }

  if (!input.advisors || input.advisors.length < 1) {
    addError('advisors', 'ต้องระบุอาจารย์ที่ปรึกษาอย่างน้อย 1 ท่าน');
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (input.githubUrl && input.githubUrl.trim() !== '') {
    if (!isValidUrl(input.githubUrl)) {
      addError('githubUrl', 'ลิงก์ GitHub ต้องเป็น URL ที่ถูกต้อง');
    }
  }

  if (input.demoUrl && input.demoUrl.trim() !== '') {
    if (!isValidUrl(input.demoUrl)) {
      addError('demoUrl', 'ลิงก์ผลงาน/Demo ต้องเป็น URL ที่ถูกต้อง');
    }
  }

  if (input.reportPdfUrl && input.reportPdfUrl.trim() !== '') {
    if (!isValidUrl(input.reportPdfUrl)) {
      addError('reportPdfUrl', 'ลิงก์ไฟล์เล่มรายงาน PDF ต้องเป็น URL ที่ถูกต้อง');
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}