import prisma from '@/lib/prisma';

function formatPackage(data) {
  const format = ({ id, kode, nama, deskripsi }) => ({
    id,
    kode,
    nama,
    deskripsi,
  });

  return Array.isArray(data) ? data.map(format) : format(data);
}

export async function GET() {
  try {
    const data = await prisma.package.findMany({
      orderBy: { id: 'asc' },
    });

    return new Response(JSON.stringify(formatPackage(data)), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal mengambil data', detail: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { kode, nama, deskripsi } = await request.json();

    if (!kode || !nama || !deskripsi) {
      return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), { status: 400 });
    }

    const created = await prisma.package.create({
      data: { kode, nama, deskripsi },
    });

    return new Response(JSON.stringify(formatPackage(created)), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal menambahkan data', detail: error.message }),
      { status: 500 }
    );
  }
}
