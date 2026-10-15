import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  logo: string | null;

  @Column({
    name: 'site_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  siteName: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  slogan: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  tel: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}