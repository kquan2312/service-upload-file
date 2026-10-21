import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';

export interface ProductPrice {
  fes: number | null;
  testShoot: number | null;
}
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
ver: string | null;

   @Column({
    type: 'jsonb',
    nullable: true,
  })
  price: ProductPrice | null;

  @Column({
    nullable: true,
  })
  size: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
images: ProductImage[];
}