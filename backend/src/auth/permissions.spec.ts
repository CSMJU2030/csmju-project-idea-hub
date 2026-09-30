import { SubsystemRole } from './core-hub-identity';
import { Permission, ROLE_PERMISSIONS, can, canAny } from './permissions';

describe('Subsystem permission model (spec §15, §16, G0 Scoping)', () => {
  describe('STUDENT', () => {
    const role = SubsystemRole.STUDENT;

    it('can read, create and manage own projects, ideas, feedbacks', () => {
      expect(can(role, Permission.PROJECT_READ)).toBe(true);
      expect(can(role, Permission.PROJECT_CREATE)).toBe(true);
      expect(can(role, Permission.PROJECT_UPDATE_OWN)).toBe(true);
      expect(can(role, Permission.PROJECT_DELETE_OWN)).toBe(true);
      expect(can(role, Permission.IDEA_READ)).toBe(true);
      expect(can(role, Permission.IDEA_CREATE)).toBe(true);
      expect(can(role, Permission.FEEDBACK_READ)).toBe(true);
      expect(can(role, Permission.FEEDBACK_CREATE)).toBe(true);
    });

    it("cannot review projects or touch other people's projects", () => {
      expect(can(role, Permission.PROJECT_REVIEW)).toBe(false);
      expect(can(role, Permission.PROJECT_UPDATE_ANY)).toBe(false);
      expect(can(role, Permission.PROJECT_DELETE_ANY)).toBe(false);
    });
  });

  describe('ALUMNI', () => {
    it('can read projects, share ideas and give feedback', () => {
      const role = SubsystemRole.ALUMNI;
      expect(can(role, Permission.PROJECT_READ)).toBe(true);
      expect(can(role, Permission.PROJECT_CREATE)).toBe(false);
      expect(can(role, Permission.PROJECT_UPDATE_OWN)).toBe(false);
      expect(can(role, Permission.IDEA_READ)).toBe(true);
      expect(can(role, Permission.FEEDBACK_READ)).toBe(true);
    });
  });

  describe('STAFF', () => {
    it('sees projects and reviews pending submissions', () => {
      const role = SubsystemRole.STAFF;
      expect(can(role, Permission.PROJECT_READ)).toBe(true);
      expect(can(role, Permission.PROJECT_REVIEW)).toBe(true);
      expect(can(role, Permission.IDEA_READ)).toBe(true);
      expect(can(role, Permission.FEEDBACK_READ)).toBe(true);
    });
  });

  describe('ADMIN', () => {
    it('holds every permission', () => {
      for (const permission of Object.values(Permission)) {
        expect(can(SubsystemRole.ADMIN, permission)).toBe(true);
      }
    });
  });

  it('canAny passes when at least one permission matches', () => {
    expect(
      canAny(SubsystemRole.STUDENT, [Permission.PROJECT_UPDATE_ANY, Permission.PROJECT_UPDATE_OWN]),
    ).toBe(true);
    expect(
      canAny(SubsystemRole.ALUMNI, [Permission.PROJECT_CREATE, Permission.PROJECT_REVIEW]),
    ).toBe(false);
  });

  it('defines permissions for every subsystem role', () => {
    for (const role of Object.values(SubsystemRole)) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
    }
  });
});
