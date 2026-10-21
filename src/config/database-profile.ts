export type DatabaseProfile = 'local' | 'neon';

export const getDatabaseProfile = (
  profile = process.env.DATABASE_PROFILE,
): DatabaseProfile | undefined => {
  if (profile === undefined || profile === '') {
    return undefined;
  }

  if (profile === 'local' || profile === 'neon') {
    return profile;
  }

  throw new Error(
    `Unsupported DATABASE_PROFILE "${profile}". Use "local" or "neon".`,
  );
};

export const getDatabaseEnvFilePath = (): string => {
  const profile = getDatabaseProfile();
  return profile ? `.env.${profile}` : '.env';
};
