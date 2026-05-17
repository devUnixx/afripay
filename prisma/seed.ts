import { PrismaClient, InvoiceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.warn("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@afripay.io" },
    update: {},
    create: {
      privyId: "privy:demo-user-id",
      email: "demo@afripay.io",
      name: "Demo Freelancer",
      stellarAddress: "GDEMO...STELLAR",
      onboarded: true,
    },
  });

  await prisma.invoice.create({
    data: {
      userId: user.id,
      title: "Website Redesign",
      clientName: "Acme Corp",
      clientEmail: "client@acme.com",
      amountUsd: 500,
      status: InvoiceStatus.PENDING,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lineItems: {
        create: [
          { description: "UI Design", quantity: 1, unitPrice: 200 },
          { description: "Frontend Development", quantity: 1, unitPrice: 300 },
        ],
      },
    },
  });

  console.warn("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
