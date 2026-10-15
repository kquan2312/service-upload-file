import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSiteSettingDto {
  @IsNotEmpty()
  @IsString()
  siteName: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  tel?: string;
}