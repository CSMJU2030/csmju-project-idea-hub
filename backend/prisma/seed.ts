/**
 * Development seed data for CS Project and Idea Hub.
 *
 * IMPORTANT: no Core Hub users, passwords or sessions are seeded here.
 * `coreUserId` values below are EXTERNAL REFERENCES to Core Hub identities
 * (the `sub` claim of a Core Hub access token) and carry no credentials.
 * They match the development accounts in the Core Hub seed:
 *   user-002 = student@core.local · user-003 = staff@core.local
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { ProjectStatus, PrismaClient } from '../generated/prisma/client';

// Prisma 7 driver adapter, bound to the subsystem's own DATABASE_URL.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('[seed] seeding csmju_project_idea_hub ...');

  if ((await prisma.project.count()) === 0) {
    const project1 = await prisma.project.create({
      data: {
        titleTh: 'ระบบจัดการร้านค้าอัจฉริยะด้วย AI',
        titleEn: 'Smart Store Management with AI',
        abstract: 'โครงงานพัฒนาระบบตรวจจับและวิเคราะห์พฤติกรรมลูกค้าภายในร้านค้าด้วย Computer Vision',
        category: 'AI / Machine Learning',
        status: ProjectStatus.APPROVED,
        ownerCoreUserId: 'user-002',
        advisorCoreUserId: 'user-003',
        academicYear: 2026,
        semester: 1,
        githubUrl: 'https://github.com/CSMJU2030/demo-ai-store',
        demoUrl: 'https://ai-store.demo.local',
        tags: {
          create: [{ tagName: 'AI' }, { tagName: 'Computer Vision' }, { tagName: 'Python' }],
        },
        members: {
          create: [
            { coreUserId: 'user-002', roleInProject: 'LEADER' },
          ],
        },
      },
    });

    const project2 = await prisma.project.create({
      data: {
        titleTh: 'ระบบติดตามการเข้าเรียนผ่าน IoT',
        titleEn: 'IoT Student Attendance System',
        abstract: 'โครงงานสร้างฮาร์ดแวร์และซอฟต์แวร์สำหรับเช็คชื่อนักศึกษาอัตโนมัติด้วย RFID และ BLE',
        category: 'IoT / Embedded Systems',
        status: ProjectStatus.PROPOSED,
        ownerCoreUserId: 'user-002',
        advisorCoreUserId: 'user-003',
        academicYear: 2026,
        semester: 1,
        tags: {
          create: [{ tagName: 'IoT' }, { tagName: 'RFID' }, { tagName: 'Next.js' }],
        },
        members: {
          create: [
            { coreUserId: 'user-002', roleInProject: 'LEADER' },
          ],
        },
      },
    });

    console.log(`[seed] created projects: ${project1.id}, ${project2.id}`);
  }

  console.log(`[seed] done: ${await prisma.project.count()} projects`);
}

main()
  .catch((error) => {
    console.error('[seed] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
