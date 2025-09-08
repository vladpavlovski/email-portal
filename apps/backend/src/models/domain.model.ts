import { Domain } from '@mailportal/shared';
import { query, getOne } from '../config/database';

export class DomainModel {
  static async findById(id: string): Promise<Domain | null> {
    const sql = 'SELECT * FROM domains WHERE id = $1';
    const result = await getOne<any>(sql, [id]);
    return result ? this.mapToDomain(result) : null;
  }

  static async findByName(name: string): Promise<Domain | null> {
    const sql = 'SELECT * FROM domains WHERE name = $1';
    const result = await getOne<any>(sql, [name]);
    return result ? this.mapToDomain(result) : null;
  }

  static async findAll(activeOnly = false): Promise<Domain[]> {
    let sql = 'SELECT * FROM domains';
    if (activeOnly) {
      sql += ' WHERE is_active = true';
    }
    sql += ' ORDER BY name ASC';
    const results = await query<any>(sql);
    return results.map(this.mapToDomain);
  }

  static async create(data: { name: string; isActive?: boolean }): Promise<Domain> {
    const sql = `
      INSERT INTO domains (name, is_active)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await getOne<any>(sql, [data.name, data.isActive ?? true]);
    return this.mapToDomain(result);
  }

  static async update(id: string, data: Partial<Domain>): Promise<Domain | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE domains
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await getOne<any>(sql, values);
    return result ? this.mapToDomain(result) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM domains WHERE id = $1';
    const result = await query(sql, [id]);
    return result.length > 0;
  }

  private static mapToDomain(row: any): Domain {
    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}