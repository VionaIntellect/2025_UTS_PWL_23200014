import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.preorder.findMany({
    orderBy: { id: 'asc' },
  });

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
  const { order_date, order_by, selected_package, qty, status } = await request.json();

  if (!order_date || !order_by || !selected_package || !qty || !status) {
    return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), {
      status: 400,
    });
  }

  const data = await prisma.preorder.create({
    data: {
      order_date: new Date(order_date),
      order_by,
      selected_package,
      qty: parseInt(qty),
      status,
    },
  });

  return new Response(JSON.stringify(data), { status: 201 });
}

export async function PUT(request) {
  const { id, order_date, order_by, selected_package, qty, status } = await request.json();

  if (!id || !order_date || !order_by || !selected_package || !qty || !status) {
    return new Response(JSON.stringify({ error: 'Field tidak lengkap' }), { status: 400 });
  }

  const updated = await prisma.preorder.update({
    where: { id },
    data: {
      order_date: new Date(order_date),
      order_by,
      selected_package,
      qty: parseInt(qty),
      status,
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID tidak ditemukan' }), { status: 400 });
  }

  await prisma.preorder.delete({
    where: { id },
  });

  return new Response(JSON.stringify({ message: 'Data berhasil dihapus' }), { status: 200 });
}
