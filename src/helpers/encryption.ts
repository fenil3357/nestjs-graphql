import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const encPassword = await bcrypt.hash(password, 12);
  return encPassword;
};

export const comparePassword = async (
  password: string,
  correctPassword: string,
) => {
  try {
    return await bcrypt.compare(password, correctPassword);
  } catch (err) {
    throw new BadRequestException('Invalid Email or password');
  }
};
