import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Supplier } from "./Supplier";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: false })
  name!: string;

  @Column({ length: 255, nullable: false })
  category!: string;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ length: 500, nullable: true })
  description!: string;

  @Column({ nullable: true })
  supplierId!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.inventoryItems, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "supplierId" })
  supplier!: Supplier;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
