// Script para criar um usuário administrador
import { hashPassword } from './server/auth.js';
import { db } from './server/db.js';
import { users } from './shared/schema.js';

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const [existingAdmin] = await db.select().from(users).where(eq(users.role, 'admin'));
    
    if (existingAdmin) {
      console.log('Um usuário administrador já existe:', existingAdmin.username);
      return;
    }
    
    // Criar um novo admin
    const adminUser = {
      username: 'admin',
      password: hashPassword('admin123'),
      name: 'Administrador',
      email: 'admin@monitorauti.com',
      role: 'admin',
      createdAt: new Date(),
    };
    
    const [newAdmin] = await db.insert(users).values(adminUser).returning();
    
    console.log('Usuário administrador criado com sucesso:', newAdmin);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();