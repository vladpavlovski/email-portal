import { User, UserRole } from '@mailportal/shared';
import { query, getOne } from '../config/database';
import bcrypt from 'bcrypt';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    const sql = `
      SELECT id, email, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await getOne<any>(sql, [id]);
    return result ? this.mapToUser(result) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT id, email, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    const result = await getOne<any>(sql, [email]);
    return result ? this.mapToUser(result) : null;
  }

  static async findByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const sql = `
      SELECT id, email, password_hash, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    const result = await getOne<any>(sql, [email]);
    if (!result) return null;
    
    const user = this.mapToUser(result);
    return { ...user, passwordHash: result.password_hash };
  }

  static async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
    `;
    const result = await getOne<any>(sql, [
      data.email,
      passwordHash,
      data.firstName,
      data.lastName,
      data.role || UserRole.USER,
    ]);
    return this.mapToUser(result);
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.lastName);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }
    if (data.canCreateEmails !== undefined) {
      fields.push(`can_create_emails = $${paramCount++}`);
      values.push(data.canCreateEmails);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
    `;
    const result = await getOne<any>(sql, values);
    return result ? this.mapToUser(result) : null;
  }

  static async findAll(filters?: { role?: UserRole; isActive?: boolean }): Promise<User[]> {
    let sql = `
      SELECT id, email, first_name, last_name, role, is_active, can_create_emails, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.role) {
      sql += ` AND role = $${paramCount++}`;
      params.push(filters.role);
    }
    if (filters?.isActive !== undefined) {
      sql += ` AND is_active = $${paramCount++}`;
      params.push(filters.isActive);
    }

    sql += ' ORDER BY created_at DESC';
    const results = await query<any>(sql, params);
    return results.map(this.mapToUser);
  }

  static async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    const result = await query(sql, [passwordHash, id]);
    return result.length > 0;
  }

  private static mapToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role as UserRole,
      isActive: row.is_active,
      canCreateEmails: row.can_create_emails,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}