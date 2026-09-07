export default function AdminQrCodePage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold text-slate-900">QR code</h1>
      <p className="mt-1 text-sm text-slate-500">
        À imprimer sur vos flyers, cartes de visite ou véhicule. Il dirige directement vers la
        page de réservation du site.
      </p>

      <div className="mt-6 inline-block rounded-2xl border border-slate-200 bg-white p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/qrcode?target=reserver" alt="QR code vers la réservation" width={280} height={280} />
      </div>

      <a
        href="/api/qrcode?target=reserver"
        download="kycks-cleaner-qrcode.png"
        className="mt-6 inline-block rounded-full bg-[#0b3d91] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Télécharger l&apos;image (PNG)
      </a>
    </div>
  );
}
