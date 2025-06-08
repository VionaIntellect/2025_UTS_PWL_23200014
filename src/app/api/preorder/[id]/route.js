import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const id = parseInt(params.id);

  try {
    const { order_date, order_by, selected_package, qty, status } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !status) {
      return new Response(JSON.stringify({ error: 'Field tidak lengkap' }), { status: 400 });
    }

    const updated = await prisma.preorder.update({
      where: { id },
      data: {
        order_date: new Date(order_date),
        order_by,
        selected_package,
        qty: Number(qty),
        status,
        is_paid: status.toLowerCase() === 'lunas',
      },
    });

    const formatted = {
      id: updated.id,
      order_date: updated.order_date.toISOString().split('T')[0],
      order_by: updated.order_by,
      selected_package: updated.selected_package,
      qty: updated.qty,
      status: updated.status,
    };

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal memperbarui data', detail: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  try {
    await prisma.preorder.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Data berhasil dihapus' }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal menghapus data', detail: error.message }),
      { status: 500 }
    );
  }
}
