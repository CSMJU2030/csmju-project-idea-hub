'use server';

import { getCurrentUser } from '../../../lib/auth';
import { showcaseRepository } from '../repositories/mock/showcase.mock-repository';
import { ActionResponse, ProjectFeedback } from '../types/domain';

interface SubmitFeedbackInput {
  projectId: string;
  rating: number; // 1-5
  comment: string;
}

export async function submitFeedbackAction(
  input: SubmitFeedbackInput
): Promise<ActionResponse<ProjectFeedback>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น' };
    }

    // ตรวจสอบสิทธิ์: ให้เฉพาะอาจารย์หรือศิษย์เก่าเท่านั้น
    if (user.role !== 'TEACHER' && user.role !== 'ALUMNI') {
      return {
        success: false,
        message: 'สิทธิ์ในการประเมินและให้ข้อเสนอแนะสงวนไว้สำหรับอาจารย์และศิษย์เก่าเท่านั้น',
      };
    }

    // ตรวจสอบคะแนน
    if (!input.rating || input.rating < 1 || input.rating > 5) {
      return { success: false, message: 'คะแนนการประเมินต้องอยู่ระหว่าง 1 ถึง 5' };
    }

    // ตรวจสอบข้อความ
    if (!input.comment || input.comment.trim().length < 5) {
      return { success: false, message: 'ความคิดเห็นต้องมีความยาวอย่างน้อย 5 ตัวอักษร' };
    }

    // ป้องกันการส่งแบบประเมินซ้ำซ้อนจากผู้ใช้รายเดิม
    const alreadyReviewed = await showcaseRepository.hasUserFeedback(input.projectId, user.id);
    if (alreadyReviewed) {
      return {
        success: false,
        message: 'คุณได้ส่งข้อเสนอแนะสำหรับโครงงานนี้ไปแล้ว ไม่สามารถส่งซ้ำได้',
      };
    }

    const newFeedback = await showcaseRepository.addFeedback({
      projectId: input.projectId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      rating: input.rating,
      comment: input.comment.trim(),
    });

    return {
      success: true,
      message: 'บันทึกข้อเสนอแนะเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็น',
      data: newFeedback,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อเสนอแนะ';
    return { success: false, message };
  }
}