/**
 * Development seed data for CS Project and Idea Hub.
 *
 * IMPORTANT: no Core Hub users, passwords or sessions are seeded here.
 * `coreUserId` values below are EXTERNAL REFERENCES to Core Hub identities
 * (the `sub` claim of a Core Hub access token) and carry no credentials.
 * They match the development accounts in the Core Hub seed:
 *   user-002 = student@core.local · user-003 = staff@core.local · user-004 = alumni@core.local
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { ProjectStatus, IdeaStatus, PrismaClient } from '../generated/prisma/client';

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
        abstract: 'โครงงานพัฒนาระบบตรวจจับและวิเคราะห์พฤติกรรมลูกค้าภายในร้านค้าด้วย Computer Vision พร้อมสถิติแบบ Real-time',
        category: 'AI / Machine Learning',
        status: ProjectStatus.APPROVED,
        ownerCoreUserId: 'user-002',
        advisorCoreUserId: 'user-003',
        academicYear: 2568,
        semester: 1,
        githubUrl: 'https://github.com/CSMJU2030/csmju-project-idea-hub',
        demoUrl: 'https://showcase.csmju2030.local',
        proposalUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/proposal.pdf',
        progressReportUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/progress-3chapters.pdf',
        fullThesisPdfUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/full-thesis.pdf',
        posterImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        chapter1Summary: 'บทที่ 1 บทนำ: ศึกษาปัญหาการจัดเก็บผลงานโครงงานพิเศษของสาขาวิทยาการคอมพิวเตอร์ที่ยังกระจัดกระจาย ขาดระบบสืบค้นผลงานของรุ่นพี่ กำหนดวัตถุประสงค์เพื่อพัฒนาระบบคลังผลงานกลางที่เชื่อมโยงกับแพลตฟอร์ม CSMJU2030',
        chapter2Summary: 'บทที่ 2 ทฤษฎีและงานวิจัยที่เกี่ยวข้อง: ศึกษาทฤษฎี Microservices, Single Sign-On (RS256 JWKS), RBAC, Design System Tokens, และการเปรียบเทียบระบบคลังผลงานวิทยานิพนธ์ของสถาบันอื่น',
        chapter3Summary: 'บทที่ 3 วิธีการดำเนินงานและการออกแบบระบบ: ออกแบบ System Architecture แบบ 1 Subsystem = 1 DB = 1 Repo, ออกแบบ DFD Level 0-2, Database ERD (Prisma snake_case), และ Wireframes ตาม CSMJU UI Tokens',
        chapter4Summary: 'บทที่ 4 ผลการดำเนินงานและการทดสอบระบบ: พัฒนาเว็บแอปพลิเคชัน Next.js App Router และ NestJS API, ทดสอบ SSO Integration T1-T9, Unit Test 78 ข้อผ่าน 100%, และการทดสอบ UAT จากกลุ่มตัวอย่างอาจารย์และนักศึกษา',
        chapter5Summary: 'บทที่ 5 สรุปผล อภิปรายผล และข้อเสนอแนะ: ระบบสามารถทำงานได้ตามวัตถุประสงค์ รองรับการสืบค้นโครงงานและให้ Feedback จากศิษย์เก่า ข้อเสนอแนะในอนาคตคือการเชื่อมต่อ AI Semantic Search และการส่งออกเล่มรายงานอัตโนมัติ',
        tags: {
          create: [{ tagName: 'AI' }, { tagName: 'Computer Vision' }, { tagName: 'Python' }, { tagName: 'Next.js' }],
        },
        members: {
          create: [
            { coreUserId: 'user-002', roleInProject: 'OWNER' },
          ],
        },
        feedbacks: {
          create: [
            {
              authorCoreUserId: 'user-004',
              authorRole: 'ALUMNI',
              comment: 'โครงงานมีความน่าสนใจมากครับ แนะนำให้เสริมเรื่อง edge computing เพิ่มเติมเพื่อลด latency',
              rating: 5,
            },
          ],
        },
        approvals: {
          create: [
            {
              reviewerCoreUserId: 'user-003',
              action: 'APPROVED',
              comment: 'อนุมัติโครงงาน ครบถ้วนตามมาตรฐาน 5 บทของหลักสูตร',
            },
          ],
        },
      },
    });

    const project2 = await prisma.project.create({
      data: {
        titleTh: 'ระบบติดตามการเข้าเรียนผ่าน IoT',
        titleEn: 'IoT Student Attendance System',
        abstract: 'โครงงานสร้างฮาร์ดแวร์และซอฟต์แวร์สำหรับเช็คชื่อนักศึกษาอัตโนมัติด้วย RFID และ BLE เชื่อมโยงข้อมูลผ่าน MQTT',
        category: 'IoT / Embedded Systems',
        status: ProjectStatus.PROPOSED,
        ownerCoreUserId: 'user-002',
        advisorCoreUserId: 'user-003',
        academicYear: 2568,
        semester: 1,
        githubUrl: 'https://github.com/CSMJU2030/demo-iot-attendance',
        proposalUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-002/proposal.pdf',
        chapter1Summary: 'บทที่ 1 บทนำ: การเช็คชื่อในชั้นเรียนขนาดใหญ่ใช้เวลานาน มีข้อผิดพลาด โครงงานจึงเสนอระบบ IoT อัตโนมัติ',
        chapter2Summary: 'บทที่ 2 ทฤษฎีที่เกี่ยวข้อง: RFID, BLE Beacons, ESP32 Microcontroller, MQTT protocol',
        chapter3Summary: 'บทที่ 3 การออกแบบ: ผังวงจร ESP32 และสถาปัตยกรรม Backend REST API',
        tags: {
          create: [{ tagName: 'IoT' }, { tagName: 'RFID' }, { tagName: 'ESP32' }],
        },
        members: {
          create: [
            { coreUserId: 'user-002', roleInProject: 'OWNER' },
          ],
        },
      },
    });

    console.log(`[seed] created projects: ${project1.id}, ${project2.id}`);
  }

  if ((await prisma.idea.count()) === 0) {
    const idea1 = await prisma.idea.create({
      data: {
        title: 'ระบบ Matching นักศึกษากับอาจารย์ที่ปรึกษาโครงงานด้วย AI',
        description: 'ระบบที่ช่วยให้นักศึกษาสามารถค้นหาและจับคู่อาจารย์ที่ปรึกษาตามความสนใจในหัวข้อวิจัย (Research Interest) และผลงานที่ผ่านมา',
        ownerCoreUserId: 'user-002',
        votesCount: 12,
        status: IdeaStatus.OPEN,
      },
    });

    const idea2 = await prisma.idea.create({
      data: {
        title: 'แพลตฟอร์มระดมโจทย์ปัญหาจริงจากศิษย์เก่า (Alumni Problem Bank)',
        description: 'เปิดให้ศิษย์เก่าในสายงานเทคโนโลยีสามารถส่งโจทย์ปัญหาจริงจากภาคอุตสาหกรรมมาให้นักศึกษารุ่นน้องเลือกทำเป็น Senior Project',
        ownerCoreUserId: 'user-004',
        votesCount: 28,
        status: IdeaStatus.EXPLORING,
      },
    });

    console.log(`[seed] created ideas: ${idea1.id}, ${idea2.id}`);
  }

  console.log(`[seed] done: ${await prisma.project.count()} projects, ${await prisma.idea.count()} ideas`);
}

main()
  .catch((error) => {
    console.error('[seed] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
