import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity('user_data')
export class UserData {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    phoneNumber: string;

    @Column({ type: 'varchar', nullable: true })
    otp: string | null

    @Column({ type: 'varchar', nullable: true })
    securityPin: string | null

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt: Date | null

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at: Date;

}
