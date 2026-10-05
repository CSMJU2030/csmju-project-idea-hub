'use server';

import { getCurrentUser } from '../../../lib/auth';
import { canReviewProject } from '../auth/permissions';
import { showcaseRepository } from '../repositories/mock/showcase.mock-repository';
import { ActionResponse, Project } from '../types/domain';

interface ReviewInput {
  projectId: string;
  action: 'APPROVE' | 'REJECT';
  rejectionReason?: string;
}

export async function reviewProjectAction(input: ReviewInput): Promise<ActionResponse<Project>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
    }

    const project = await showcaseRepository.findProjectById(input.projectId);
    if (!project) {
      return { success: false, message: 'ไม่พบข้อมูลโครงงานที่ต้องการตรวจสอบ' };
    }

    // ตรวจสอบสิทธิ์ที่ Server: ต้องเป็นอาจารย์ที่ปรึกษาของโปรเจกต์นี้เท่านั้น
    if (!canReviewProject(user, project)) {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์อนุมัติโครงงานนี้ (เฉพาะอาจารย์ที่ปรึกษาของโครงงานเท่านั้น)',
      };
    }

    if (input.action === 'REJECT') {
      if (!input.rejectionReason || input.rejectionReason.trim().length < 5) {
        return {
          success: false,
          message: 'กรุณาระบุเหตุผลหรือข้อเสนอแนะในการปรับปรุงอย่างน้อย 5 ตัวอักษร',
        };
      }

      const updated = await showcaseRepository.updateProject(project.id, {
        status: 'REJECTED',
        rejectionReason: input.rejectionReason.trim(),
      });

      return {
        success: true,
        message: 'ปฏิเสธและส่งข้อเสนอแนะกลับให้นักศึกษาเรียบร้อยแล้ว',
        data: updated,
      };
    }

    // กรณี APPROVE
    const updated = await showcaseRepository.updateProject(project.id, {
      status: 'APPROVED',
      rejectionReason: undefined,
    });

    return {
      success: true,
      message: 'อนุมัติโครงงานเรียบร้อยแล้ว ผลงานจะแสดงสู่สาธารณะทันที',
      data: updated,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการตรวจสอบโครงงาน';
    return { success: false, message };
  }
}