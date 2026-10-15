import { Test, TestingModule } from '@nestjs/testing';
import { SiteSettingController } from './site-setting.controller';
import { SiteSettingService } from './site-setting.service';

describe('SiteSettingController', () => {
  let controller: SiteSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteSettingController],
      providers: [SiteSettingService],
    }).compile();

    controller = module.get<SiteSettingController>(SiteSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
