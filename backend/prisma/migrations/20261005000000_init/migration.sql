-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PROPOSED', 'APPROVED', 'REQUESTED_CHANGES', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('OPEN', 'EXPLORING', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title_th" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PROPOSED',
    "owner_core_user_id" TEXT NOT NULL,
    "advisor_core_user_id" TEXT,
    "academic_year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "github_url" TEXT,
    "demo_url" TEXT,
    "proposal_url" TEXT,
    "progress_report_url" TEXT,
    "full_thesis_pdf_url" TEXT,
    "poster_image_url" TEXT,
    "demo_video_url" TEXT,
    "chapter1_summary" TEXT,
    "chapter2_summary" TEXT,
    "chapter3_summary" TEXT,
    "chapter4_summary" TEXT,
    "chapter5_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "core_user_id" TEXT NOT NULL,
    "role_in_project" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "tag_name" TEXT NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_core_user_id" TEXT NOT NULL,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "status" "IdeaStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_feedbacks" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "author_core_user_id" TEXT NOT NULL,
    "author_role" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_approvals" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "reviewer_core_user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_owner_core_user_id_idx" ON "projects"("owner_core_user_id");

-- CreateIndex
CREATE INDEX "projects_advisor_core_user_id_idx" ON "projects"("advisor_core_user_id");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");

-- CreateIndex
CREATE INDEX "project_members_project_id_idx" ON "project_members"("project_id");

-- CreateIndex
CREATE INDEX "project_members_core_user_id_idx" ON "project_members"("core_user_id");

-- CreateIndex
CREATE INDEX "project_tags_project_id_idx" ON "project_tags"("project_id");

-- CreateIndex
CREATE INDEX "ideas_owner_core_user_id_idx" ON "ideas"("owner_core_user_id");

-- CreateIndex
CREATE INDEX "ideas_status_idx" ON "ideas"("status");

-- CreateIndex
CREATE INDEX "project_feedbacks_project_id_idx" ON "project_feedbacks"("project_id");

-- CreateIndex
CREATE INDEX "project_approvals_project_id_idx" ON "project_approvals"("project_id");

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_feedbacks" ADD CONSTRAINT "project_feedbacks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_approvals" ADD CONSTRAINT "project_approvals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
