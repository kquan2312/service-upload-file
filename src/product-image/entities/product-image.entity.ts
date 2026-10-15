import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'product_id',
    nullable: true,
  })
  productId: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  url: string;

  @Column({
    name: 'is_thumbnail',
    default: false,
    nullable: true,
  })
  isThumbnail: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;
}