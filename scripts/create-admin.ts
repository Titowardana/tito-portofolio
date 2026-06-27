import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  const name = process.env.ADMIN_NAME;
  const emailRaw = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !emailRaw || !password) {
    fail(
      "Missing required environment variables:\n" +
        "  ADMIN_NAME     (current: " +
        (name ? "set" : "MISSING") +
        ")\n" +
        "  ADMIN_EMAIL    (current: " +
        (emailRaw ? "set" : "MISSING") +
        ")\n" +
        "  ADMIN_PASSWORD (current: " +
        (password ? "set" : "MISSING") +
        ")\n\n" +
        "Usage:\n" +
        '  $env:ADMIN_NAME="Admin Name"; $env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="your-password"; npx tsx scripts/create-admin.ts',
    );
  }

  const email = emailRaw.toLowerCase().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fail("Invalid email format: " + email);
  }

  if (password.length < 12) {
    fail("Password must be at least 12 characters");
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "admin",
      isActive: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  const action = user.createdAt.getTime() === user.updatedAt.getTime() ? "created" : "updated";
  console.log("Admin user " + action + ": " + user.email);
}

main()
  .catch((error) => {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
