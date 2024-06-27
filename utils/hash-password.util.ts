// src/utils/hash-password.util.ts
import {hash, genSalt, compare} from 'bcrypt';

export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}
