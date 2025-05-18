import prisma from '@/lib/prisma';

function getIdFromRequestURL(request) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  return parseInt(parts[parts.length - 1]);
}

export async function PUT(request) {
  const id = getIdFromRequestURL(request);

  try {
    const { kode, nama, deskripsi } = await request.json();

    if (!kode || !nama || !deskripsi) {
      return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), { status: 400 });
    }

    const updated = await prisma.package.update({
      where: { id },
      data: { kode, nama, deskripsi },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal memperbarui data', detail: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const id = getIdFromRequestURL(request);

  try {
    await prisma.package.delete({
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
