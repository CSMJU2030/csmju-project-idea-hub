'use server';

import { getCurrentUser } from '../../../lib/auth';
import { showcaseRepository } from '../repositories/mock/showcase.mock-repository';
import { ActionResponse, ProjectIdea } from '../types/domain';

interface CreateIdeaInput {
  title: string;
  description: string;
  tags: string[];
}

export async function createIdeaAction(input: CreateIdeaInput): Promise<ActionResponse<ProjectIdea>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนเสนอไอเดีย' };
    }

    if (!input.title || input.title.trim().length < 5) {
      return { success: false, message: 'ชื่อไอเดียต้องมีความยาวอย่างน้อย 5 ตัวอักษร' };
    }

    if (!input.description || input.description.trim().length < 15) {
      return { success: false, message: 'รายละเอียดไอเดียต้องมีความยาวอย่างน้อย 15 ตัวอักษร' };
    }

    const newIdea = await showcaseRepository.createIdea({
      title: input.title.trim(),
      description: input.description.trim(),
      tags: input.tags || [],
      status: 'OPEN',
      proposedBy: {
        coreUserId: user.id,
        name: user.name,
        role: user.role,
      },
    });

    return {
      success: true,
      message: 'บันทึกไอเดียเข้าสู่ Idea Bank สำเร็จ',
      data: newIdea,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกไอเดีย';
    return { success: false, message };
  }
}

export const proposeIdeaAction = createIdeaAction;