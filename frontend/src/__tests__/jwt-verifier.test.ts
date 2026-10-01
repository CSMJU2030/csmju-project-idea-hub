import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { verifyCoreHubToken } from '../modules/showcase/auth/jwt-verifier';

describe('Core Hub JWT Verifier (auth-contract.md 8-step)', () => {
  it('ปฏิเสธเมื่อ token ว่างเปล่า', async () => {
    const res = await verifyCoreHubToken('');
    assert.equal(res.isValid, false);
    assert.ok(res.error);
  });

  it('ปฏิเสธเมื่อ token มีโครงสร้างไม่ครบ 3 ส่วน', async () => {
    const res = await verifyCoreHubToken('invalid.token');
    assert.equal(res.isValid, false);
    assert.ok(res.error?.includes('structure'));
  });

  it('ปฏิเสธเมื่อ header ไม่ใช่ JSON ที่ถูกต้อง', async () => {
    const res = await verifyCoreHubToken('not-json.payload.signature');
    assert.equal(res.isValid, false);
    assert.ok(res.error?.includes('header'));
  });

  it('ปฏิเสธเมื่อ algorithm ไม่ใช่ RS256 (ปฏิเสธ HS256 / none)', async () => {
    const badHeader = Buffer.from(JSON.stringify({ alg: 'HS256', kid: 'core-hub-2026' })).toString('base64url');
    const dummyPayload = Buffer.from(JSON.stringify({ sub: 'user-001', iss: 'core-hub', aud: 'csmju2030' })).toString('base64url');
    const dummySig = Buffer.from('sig').toString('base64url');

    const res = await verifyCoreHubToken(`${badHeader}.${dummyPayload}.${dummySig}`);
    assert.equal(res.isValid, false);
    assert.ok(res.error?.includes('Unauthorized algorithm'));
  });

  it('ปฏิเสธเมื่อ header ไม่มี kid', async () => {
    const noKidHeader = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
    const dummyPayload = Buffer.from(JSON.stringify({ sub: 'user-001', iss: 'core-hub', aud: 'csmju2030' })).toString('base64url');
    const dummySig = Buffer.from('sig').toString('base64url');

    const res = await verifyCoreHubToken(`${noKidHeader}.${dummyPayload}.${dummySig}`);
    assert.equal(res.isValid, false);
    assert.ok(res.error?.includes('kid'));
  });
});
