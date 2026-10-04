'use server';

import { getCurrentUser } from '../auth/core-auth.adapter';
import { canEditProject, canDeleteProject } from '../auth/permissions';
import { showcaseRepository } from '../repositories/mock/showcase.mock-repository';
import { ActionResponse, CreateProjectInput, UpdateProjectInput, Project, ProjectMember, DashboardStats } from '../types/domain';
import { validateProjectInput } from '../utils/validation';
import { checkDuplicateTitle, DuplicateCheckResult } from '../utils/anti-duplicate';

export async function createProjectAction(input: CreateProjectInput): Promise<ActionResponse<Project>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
    }

    const validation = validateProjectInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อผิดพลาด',
        errors: validation.errors,
      };
    }

    const members = input.members.map((m) => ({
      ...m,
      isOwner: m.studentId === user.id,
    }));

    if (!members.some((m) => m.studentId === user.id)) {
      members.unshift({
        studentId: user.id,
        name: user.name,
        isOwner: true,
      });
    }

    const newProject = await showcaseRepository.createProject({
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      abstract: input.abstract,
      academicYear: input.academicYear,
      category: input.category,
      tags: input.tags || [],
      techStack: input.techStack || [],
      members,
      advisors: input.advisors,
      githubUrl: input.githubUrl,
      demoUrl: input.demoUrl,
      reportPdfUrl: input.reportPdfUrl || input.fullThesisPdfUrl,
      proposalUrl: input.proposalUrl,
      progressReportUrl: input.progressReportUrl,
      fullThesisPdfUrl: input.fullThesisPdfUrl || input.reportPdfUrl,
      posterImageUrl: input.posterImageUrl,
      demoVideoUrl: input.demoVideoUrl,
      chaptersSummary: input.chaptersSummary,
      status: 'PENDING_APPROVAL',
    });

    return {
      success: true,
      message: 'ส่งข้อมูลโครงงานเพื่อรอการอนุมัติสำเร็จ',
      data: newProject,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
    return { success: false, message };
  }
}

export async function updateProjectAction(input: UpdateProjectInput): Promise<ActionResponse<Project>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
    }

    const project = await showcaseRepository.findProjectById(input.id);
    if (!project) {
      return { success: false, message: 'ไม่พบข้อมูลโครงงานที่ต้องการแก้ไข' };
    }

    if (!canEditProject(user, project)) {
      return { success: false, message: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลโครงงานนี้' };
    }

    const members: ProjectMember[] | undefined = input.members
      ? input.members.map((m) => ({
          studentId: m.studentId,
          name: m.name,
          isOwner: m.studentId === user.id || project.members.find((pm) => pm.studentId === m.studentId)?.isOwner || false,
        }))
      : undefined;

    const updated = await showcaseRepository.updateProject(input.id, {
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      abstract: input.abstract,
      academicYear: input.academicYear,
      category: input.category,
      tags: input.tags,
      techStack: input.techStack,
      advisors: input.advisors,
      githubUrl: input.githubUrl,
      demoUrl: input.demoUrl,
      reportPdfUrl: input.reportPdfUrl || input.fullThesisPdfUrl,
      proposalUrl: input.proposalUrl,
      progressReportUrl: input.progressReportUrl,
      fullThesisPdfUrl: input.fullThesisPdfUrl || input.reportPdfUrl,
      posterImageUrl: input.posterImageUrl,
      demoVideoUrl: input.demoVideoUrl,
      chaptersSummary: input.chaptersSummary,
      ...(members ? { members } : {}),
      status: project.status === 'REJECTED' ? 'PENDING_APPROVAL' : project.status,
    });

    return {
      success: true,
      message: 'แก้ไขข้อมูลโครงงานสำเร็จ',
      data: updated,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล';
    return { success: false, message };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResponse<{ id: string; deleted: boolean }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
    }

    const project = await showcaseRepository.findProjectById(id);
    if (!project) {
      return { success: false, message: 'ไม่พบข้อมูลโครงงานที่ต้องการลบ' };
    }

    if (!canDeleteProject(user, project)) {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบข้อมูลโครงงานนี้ (เฉพาะเจ้าของผลงานเท่านั้น)',
      };
    }

    const deleted = await showcaseRepository.deleteProject(id);
    if (!deleted) {
      return { success: false, message: 'ไม่สามารถลบข้อมูลโครงงานได้' };
    }

    return {
      success: true,
      message: 'ลบโครงงานเรียบร้อยแล้ว',
      data: { id, deleted: true },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบโครงงาน';
    return { success: false, message };
  }
}

export async function checkTitleDuplicateAction(title: string): Promise<ActionResponse<DuplicateCheckResult>> {
  try {
    if (!title || title.trim().length < 3) {
      return {
        success: true,
        data: { isDuplicate: false, score: 0 },
        message: 'ข้อความสั้นเกินไปสำหรับการตรวจสอบ',
      };
    }

    // ดึงเฉพาะโครงงานที่อนุมัติแล้วมาเปรียบเทียบ
    const existing = await showcaseRepository.findProjects({ status: 'APPROVED' });
    const result = checkDuplicateTitle(title, existing);

    return {
      success: true,
      message: result.isDuplicate ? 'พบหัวข้อที่มีความคล้ายคลึงกันในระบบ' : 'สามารถใช้หัวข้อนี้ได้',
      data: result,
    };
  } catch {
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบหัวข้อซ้ำ',
    };
  }
}

export async function getDashboardStatsAction(): Promise<ActionResponse<DashboardStats>> {
  try {
    const user = await getCurrentUser();
    
    // ตรวจสอบสิทธิ์ Server: อนุญาตเฉพาะ ADMIN เท่านั้น
    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์เข้าถึงแดชบอร์ดสถิติ (สำหรับผู้ดูแลระบบเท่านั้น)',
      };
    }

    const allProjects = await showcaseRepository.findProjects();
    const totalProjects = allProjects.length;

    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    const techCountMap: Record<string, number> = {};
    const categoryCountMap: Record<string, number> = {};

    for (const proj of allProjects) {
      if (proj.status === 'APPROVED') approvedCount++;
      else if (proj.status === 'PENDING_APPROVAL') pendingCount++;
      else if (proj.status === 'REJECTED') rejectedCount++;

      // นับสถิติหมวดหมู่
      categoryCountMap[proj.category] = (categoryCountMap[proj.category] || 0) + 1;

      // นับความถี่ของ Tech Stack
      for (const tech of proj.techStack) {
        const cleaned = tech.trim();
        if (cleaned) {
          techCountMap[cleaned] = (techCountMap[cleaned] || 0) + 1;
        }
      }
    }

    // จัดอันดับ Tech Stack ยอดนิยม 5 อันดับแรก
    const topTechStacks = Object.entries(techCountMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const categoryDistribution = Object.entries(categoryCountMap).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      success: true,
      message: 'ดึงข้อมูลสถิติสำเร็จ',
      data: {
        totalProjects,
        approvedCount,
        pendingCount,
        rejectedCount,
        topTechStacks,
        categoryDistribution,
      },
    };
  } catch {
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการคำนวณข้อมูลสถิติ',
    };
  }
}