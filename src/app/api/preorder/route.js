import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.preorder.findMany({
      orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal mengambil data' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { order_date, order_by, selected_package, qty, status } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !status) {
      return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), { status: 400 });
    }

    const data = await prisma.preorder.create({
      data: {
        order_date: new Date(order_date),
        order_by,
        selected_package,
        qty: parseInt(qty),
        status,
        is_paid: status.toLowerCase() === 'lunas',
      },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal menambahkan data', detail: error.message }), {
      status: 500,
    });
  }
}
