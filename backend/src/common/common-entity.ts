import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class CommonEntity {
  static readonly DEFAULT_AVATAR = 'https://i.pravatar.cc/300';

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      ...(this as Record<string, unknown>),
    };

    if (this.createdAt instanceof Date) {
      obj.createdAt = this.createdAt.toISOString();
    }
    if (this.updatedAt instanceof Date) {
      obj.updatedAt = this.updatedAt.toISOString();
    }

    for (const [key, val] of Object.entries(obj)) {
      if (val && typeof val === 'object') {
        const maybeWithToJSON = val as { toJSON?: () => unknown };
        if (typeof maybeWithToJSON.toJSON === 'function') {
          obj[key] = maybeWithToJSON.toJSON();
        } else if (Array.isArray(val)) {
          obj[key] = val.map((el) => {
            if (el && typeof el === 'object') {
              const elWithToJSON = el as { toJSON?: () => unknown };
              return typeof elWithToJSON.toJSON === 'function'
                ? elWithToJSON.toJSON()
                : el;
            }
            return el;
          });
        }
      }
    }

    return obj;
  }
}
