import { databaseConfig } from './database.config';
import { getDatabaseEnvFilePath, getDatabaseProfile } from './database-profile';

describe('database profile configuration', () => {
  const originalProfile = process.env.DATABASE_PROFILE;

  afterEach(() => {
    if (originalProfile === undefined) {
      delete process.env.DATABASE_PROFILE;
    } else {
      process.env.DATABASE_PROFILE = originalProfile;
    }
  });

  it('uses the local env file and disables SSL for local PostgreSQL', () => {
    process.env.DATABASE_PROFILE = 'local';

    expect(getDatabaseEnvFilePath()).toBe('.env.local');
    expect(databaseConfig()).toMatchObject({
      ssl: false,
      extra: { ssl: false },
    });
  });

  it('uses the Neon env file and enables SSL for Neon', () => {
    process.env.DATABASE_PROFILE = 'neon';

    expect(getDatabaseEnvFilePath()).toBe('.env.neon');
    expect(databaseConfig()).toMatchObject({
      ssl: { rejectUnauthorized: true },
      extra: { ssl: { rejectUnauthorized: true } },
    });
  });

  it('keeps the existing .env and SSL defaults without a profile', () => {
    delete process.env.DATABASE_PROFILE;

    expect(getDatabaseEnvFilePath()).toBe('.env');
    expect(databaseConfig().ssl).toEqual({ rejectUnauthorized: true });
  });

  it('rejects unsupported profiles', () => {
    process.env.DATABASE_PROFILE = 'staging';

    expect(() => getDatabaseProfile()).toThrow(
      'Unsupported DATABASE_PROFILE "staging". Use "local" or "neon".',
    );
  });
});
