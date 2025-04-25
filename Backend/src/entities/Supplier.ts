import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Inventory } from "./Inventory";

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: false })
  name!: string;

  @Column({ length: 255, nullable: false })
  contactName!: string;

  @Column({ length: 255, nullable: false })
  email!: string;

  @Column({ length: 50, nullable: false })
  phone!: string;

  @Column({ length: 500, nullable: true })
  address!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Inventory, (inventory) => inventory.supplier)
  inventoryItems!: Inventory[];
}
