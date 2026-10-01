import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { validateProjectInput } from '../modules/showcase/utils/validation';
import { canEditProject, canReviewProject, canDeleteProject } from '../modules/showcase/auth/permissions';
import { checkDuplicateTitle, calculateSimilarity } from '../modules/showcase/utils/anti-duplicate';
import { Project, UserContext } from '../modules/showcase/types/domain';

// ข้อมูลจำลองสำหรับทดสอบ
const mockProject: Project = {
  id: 'proj-test-001',
  titleTh: 'ระบบคลังโปรเจกต์และไอเดีย CSMJU',
  titleEn: 'CSMJU Project Showcase Hub',
  abstract: 'ระบบจัดการและจัดแสดงผลงานวิทยานิพนธ์และไอเดียเทคโนโลยีสำหรับนักศึกษา',
  academicYear: 2568,
  category: 'Web Application',
  tags: ['Next.js', 'TypeScript'],
  techStack: ['Next.js', 'PostgreSQL'],
  members: [
    { studentId: 'std-owner', name: 'นายหัวหน้า โครงงาน', isOwner: true },
    { studentId: 'std-member', name: 'นายสมาชิก โครงงาน', isOwner: false },
  ],
  advisors: [
    { advisorId: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา หลัก' },
  ],
  status: 'PENDING_APPROVAL',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ownerUser: UserContext = {
  id: 'std-owner',
  name: 'นายหัวหน้า โครงงาน',
  email: 'owner@mju.ac.th',
  role: 'STUDENT',
};

const nonOwnerUser: UserContext = {
  id: 'std-other',
  name: 'นายคนอื่น ไม่ใช่เจ้าของ',
  email: 'other@mju.ac.th',
  role: 'STUDENT',
};

const advisorUser: UserContext = {
  id: 'adv-001',
  name: 'ผศ.ดร. ที่ปรึกษา หลัก',
  email: 'advisor@mju.ac.th',
  role: 'TEACHER',
};

const otherTeacherUser: UserContext = {
  id: 'adv-999',
  name: 'อ.ที่ปรึกษา ท่านอื่น',
  email: 'other_teacher@mju.ac.th',
  role: 'TEACHER',
};

const adminUser: UserContext = {
  id: 'admin-001',
  name: 'ผู้ดูแลระบบ',
  email: 'admin@mju.ac.th',
  role: 'ADMIN',
};

describe('1. Input Validation Rules', () => {
  it('ผ่านเมื่อข้อมูลครบถ้วนถูกต้อง', () => {
    const res = validateProjectInput({
      titleTh: 'ระบบจัดการฟาร์มอัจฉริยะ',
      titleEn: 'Smart Farming IoT System',
      abstract: 'ระบบตรวจสอบความชื้นและอุณหภูมิในโรงเรือนผ่านเซนเซอร์ไร้สายและแดชบอร์ด',
      academicYear: 2568,
      category: 'IoT & Embedded Systems',
      tags: ['IoT'],
      techStack: ['Node.js', 'ESP32'],
      members: [{ studentId: 'std-01', name: 'สมชาย' }],
      advisors: [{ advisorId: 'adv-01', name: 'อาจารย์ใจดี' }],
      githubUrl: 'https://github.com/csmju/smart-farm',
      reportPdfUrl: 'https://example.com/report.pdf',
    });
    assert.equal(res.isValid, true);
    assert.equal(Object.keys(res.errors).length, 0);
  });

  it('ไม่ผ่านเมื่อปีการศึกษาไม่อยู่ในช่วง พ.ศ. ที่กำหนด (2560-2580)', () => {
    const res = validateProjectInput({
      titleTh: 'ระบบทดสอบปีการศึกษาผิดพลาด',
      titleEn: 'Invalid Year Test Project',
      abstract: 'คำอธิบายโครงการความยาวเพียงพอตามเกณฑ์ที่ระบบกำหนดไว้',
      academicYear: 2026, // ใส่ ค.ศ. แทน พ.ศ.
      category: 'Web Application',
      tags: [],
      techStack: ['React'],
      members: [{ studentId: 'std-01', name: 'สมชาย' }],
      advisors: [{ advisorId: 'adv-01', name: 'อาจารย์ใจดี' }],
    });
    assert.equal(res.isValid, false);
    assert.ok(res.errors.academicYear);
  });

  it('ไม่ผ่านเมื่อ URL ผิดรูปแบบ', () => {
    const res = validateProjectInput({
      titleTh: 'ระบบทดสอบลิงก์ผิดรูปแบบ',
      titleEn: 'Invalid URL Test Project',
      abstract: 'คำอธิบายโครงการความยาวเพียงพอตามเกณฑ์ที่ระบบกำหนดไว้',
      academicYear: 2568,
      category: 'Web Application',
      tags: [],
      techStack: ['React'],
      members: [{ studentId: 'std-01', name: 'สมชาย' }],
      advisors: [{ advisorId: 'adv-01', name: 'อาจารย์ใจดี' }],
      githubUrl: 'not-a-valid-url',
    });
    assert.equal(res.isValid, false);
    assert.ok(res.errors.githubUrl);
  });
});

describe('2. Authorization & Ownership Rules (403 Forbidden Cases)', () => {
  it('เฉพาะเจ้าของผลงาน (isOwner: true) หรือ Admin เท่านั้นที่แก้ไขได้', () => {
    assert.equal(canEditProject(ownerUser, mockProject), true);
    assert.equal(canEditProject(adminUser, mockProject), true);
    assert.equal(canEditProject(nonOwnerUser, mockProject), false); // 403 Forbidden
  });

  it('เฉพาะเจ้าของผลงาน หรือ Admin เท่านั้นที่ลบโครงงานได้', () => {
    assert.equal(canDeleteProject(ownerUser, mockProject), true);
    assert.equal(canDeleteProject(adminUser, mockProject), true);
    assert.equal(canDeleteProject(nonOwnerUser, mockProject), false); // 403 Forbidden
  });

  it('เฉพาะอาจารย์ที่ปรึกษาของโครงงานนั้น หรือ Admin เท่านั้นที่ตรวจอนุมัติได้', () => {
    assert.equal(canReviewProject(advisorUser, mockProject), true);
    assert.equal(canReviewProject(adminUser, mockProject), true);
    assert.equal(canReviewProject(otherTeacherUser, mockProject), false); // 403 Forbidden
    assert.equal(canReviewProject(ownerUser, mockProject), false); // นักศึกษาไม่มีสิทธิ์อนุมัติงานตัวเอง
  });
});

describe('3. Anti-Duplicate Title Check', () => {
  it('ตรวจจับหัวข้อซ้ำ 100% เมื่อชื่อตรงกัน', () => {
    const result = checkDuplicateTitle('ระบบคลังโปรเจกต์และไอเดีย CSMJU', [mockProject]);
    assert.equal(result.isDuplicate, true);
    assert.equal(result.score, 100);
    assert.equal(result.matchedProjectId, mockProject.id);
  });

  it('ตรวจจับหัวข้อที่คล้ายคลึงกันสูง (>= 75%)', () => {
    const sim = calculateSimilarity('ระบบคลังโปรเจกต์และไอเดีย CSMJU', 'ระบบคลังโปรเจกต์และไอเดีย');
    assert.ok(sim >= 0.75);
  });

  it('ยอมรับหัวข้อที่ไม่ซ้ำและมีคะแนนความคล้ายคลึงต่ำ', () => {
    const result = checkDuplicateTitle('ระบบบริหารจัดการแปลงปลูกข้าวอัจฉริยะ', [mockProject]);
    assert.equal(result.isDuplicate, false);
    assert.ok(result.score < 50);
  });
});
