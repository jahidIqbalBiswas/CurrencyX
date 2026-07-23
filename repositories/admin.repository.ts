import { connectToDatabase } from "@/config/database";
import { Admin } from "@/models/admin.model";
import type { IAdmin } from "@/types/database.types";

export const AdminRepository = {
  async findByEmail(email: string): Promise<IAdmin | null> {
    await connectToDatabase();
    return Admin.findOne({ email: email.toLowerCase() }).lean<IAdmin>();
  },

  async create(email: string, passwordHash: string): Promise<IAdmin> {
    await connectToDatabase();
    const admin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash,
    });
    return admin.toObject() as IAdmin;
  },

  async exists(): Promise<boolean> {
    await connectToDatabase();
    const count = await Admin.countDocuments();
    return count > 0;
  },
};
