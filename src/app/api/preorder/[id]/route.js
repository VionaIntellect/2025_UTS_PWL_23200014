import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { id } = params;
  const { order_date, order_by, selected_package, qty, status } = await request.json();

  if (!order_date || !order_by || !selected_package || !qty || !status) {
    return new Response(JSON.stringify({ error: 'Field tidak lengkap' }), { status: 400 });
  }

  try {
    const updated = await prisma.preorder.update({
      where: { id: Number(id) },
      data: {
        order_date: new Date(order_date),
        order_by,
        selected_package,
        qty: Number(qty),
        status,
        is_paid: status.toLowerCase() === 'lunas',
      },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal memperbarui data', detail: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    await prisma.preorder.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ message: 'Data berhasil dihapus' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal menghapus data', detail: error.message }), {
      status: 500,
    });
  }
}
