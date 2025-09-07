import { EmailAccount } from '@mailportal/shared';
import { query, getOne } from '../config/database';

export class EmailAccountModel {
  static async findById(id: string): Promise<EmailAccount | null> {
    const sql = `
      SELECT ea.*, d.name as domain_name, d.is_active as domain_active,
             u.email as user_email, u.first_name, u.last_name
      FROM email_accounts ea
      JOIN domains d ON ea.domain_id = d.id
      JOIN users u ON ea.user_id = u.id
      WHERE ea.id = $1
    `;
    const result = await getOne<any>(sql, [id]);
    return result ? this.mapToEmailAccount(result) : null;
  }

  static async findByEmail(email: string): Promise<EmailAccount | null> {
    const sql = `
      SELECT ea.*, d.name as domain_name, d.is_active as domain_active,
             u.email as user_email, u.first_name, u.last_name
      FROM email_accounts ea
      JOIN domains d ON ea.domain_id = d.id
      JOIN users u ON ea.user_id = u.id
      WHERE ea.email = $1
    `;
    const result = await getOne<any>(sql, [email]);
    return result ? this.mapToEmailAccount(result) : null;
  }

  static async findByUserId(userId: string): Promise<EmailAccount[]> {
    const sql = `
      SELECT ea.*, d.name as domain_name, d.is_active as domain_active,
             u.email as user_email, u.first_name, u.last_name
      FROM email_accounts ea
      JOIN domains d ON ea.domain_id = d.id
      JOIN users u ON ea.user_id = u.id
      WHERE ea.user_id = $1
      ORDER BY ea.created_at DESC
    `;
    const results = await query<any>(sql, [userId]);
    return results.map(this.mapToEmailAccount);
  }

  static async findAll(filters?: { userId?: string; domainId?: string }): Promise<EmailAccount[]> {
    let sql = `
      SELECT ea.*, d.name as domain_name, d.is_active as domain_active,
             u.email as user_email, u.first_name, u.last_name
      FROM email_accounts ea
      JOIN domains d ON ea.domain_id = d.id
      JOIN users u ON ea.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.userId) {
      sql += ` AND ea.user_id = $${paramCount++}`;
      params.push(filters.userId);
    }
    if (filters?.domainId) {
      sql += ` AND ea.domain_id = $${paramCount++}`;
      params.push(filters.domainId);
    }

    sql += ' ORDER BY ea.created_at DESC';
    const results = await query<any>(sql, params);
    return results.map(this.mapToEmailAccount);
  }

  static async create(data: {
    email: string;
    domainId: string;
    userId: string;
    quota?: number;
  }): Promise<EmailAccount> {
    const sql = `
      INSERT INTO email_accounts (email, domain_id, user_id, quota)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await getOne<any>(sql, [
      data.email,
      data.domainId,
      data.userId,
      data.quota || 1024, // Default 1GB
    ]);

    // Fetch with joined data
    return this.findById(result.id) as Promise<EmailAccount>;
  }

  static async countByUserId(userId: string): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM email_accounts WHERE user_id = $1';
    const result = await getOne<{ count: string }>(sql, [userId]);
    return parseInt(result?.count || '0', 10);
  }

  static async exists(email: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM email_accounts WHERE email = $1';
    const result = await getOne(sql, [email]);
    return !!result;
  }

  private static mapToEmailAccount(row: any): EmailAccount {
    const account: EmailAccount = {
      id: row.id,
      email: row.email,
      domainId: row.domain_id,
      userId: row.user_id,
      quota: row.quota,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    if (row.domain_name) {
      account.domain = {
        id: row.domain_id,
        name: row.domain_name,
        isActive: row.domain_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }

    if (row.user_email) {
      account.user = {
        id: row.user_id,
        email: row.user_email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        isActive: row.is_active,
        canCreateEmails: row.can_create_emails,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }

    return account;
  }
}