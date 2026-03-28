import React, { useState } from 'react';
import { FileText, Building2, Users, Printer, Loader2, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { House, Collaborator } from '../types';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ReportsPageProps {
  houses: House[];
  collaborators: Collaborator[];
}

type ReportType = 'by_house' | 'unallocated' | 'full_list';
type ActionType = 'print' | 'share';

interface ReportConfig {
  id: ReportType;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const REPORTS: ReportConfig[] = [
  {
    id: 'by_house',
    icon: Building2,
    title: 'Por Alojamento',
    description: 'Colaboradores agrupados por república e quarto.',
    color: 'from-primary-dark to-primary-vibrant',
  },
  {
    id: 'full_list',
    icon: Users,
    title: 'Lista Geral',
    description: 'Relação completa de todos os colaboradores cadastrados.',
    color: 'from-button to-primary-vibrant',
  },
  {
    id: 'unallocated',
    icon: FileText,
    title: 'Sem Alojamento',
    description: 'Colaboradores que ainda não possuem quarto atribuído.',
    color: 'from-accent to-primary-vibrant',
  },
];

export const ReportsPage = ({ houses, collaborators }: ReportsPageProps) => {
  const [pendingReport, setPendingReport] = useState<ReportType | null>(null);
  const [processing, setProcessing] = useState<ActionType | null>(null);

  const getAllocatedIds = (): Set<string> => {
    const ids = new Set<string>();
    houses.forEach(h => h.rooms.forEach(r => r.occupants.forEach(o => { if (o) ids.add(o); })));
    return ids;
  };

  const getCollaboratorById = (id: string) => collaborators.find(c => c.id === id);

  const getSlotStats = () => {
    let total = 0; let occupied = 0;
    houses.forEach(h => h.rooms.forEach(r => {
      total += r.capacity;
      occupied += r.occupants.filter(Boolean).length;
    }));
    return { total, occupied, available: total - occupied };
  };

  const buildHtmlContent = (reportId: ReportType): { html: string; title: string } => {
    const { total, occupied, available } = getSlotStats();

    const summaryBox = `
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        <div style="flex:1;background:#f8fafc;border-radius:10px;padding:14px 12px;text-align:center;border:1px solid #e2e8f0;">
          <p style="font-size:20px;font-weight:900;color:#35126E;">${total}</p>
          <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-top:2px;">Total de Vagas</p>
        </div>
        <div style="flex:1;background:#f0fdf4;border-radius:10px;padding:14px 12px;text-align:center;border:1px solid #bbf7d0;">
          <p style="font-size:20px;font-weight:900;color:#16a34a;">${occupied}</p>
          <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#86efac;margin-top:2px;">Ocupadas</p>
        </div>
        <div style="flex:1;background:#eff6ff;border-radius:10px;padding:14px 12px;text-align:center;border:1px solid #bfdbfe;">
          <p style="font-size:20px;font-weight:900;color:#2563eb;">${available}</p>
          <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#93c5fd;margin-top:2px;">Disponíveis</p>
        </div>
      </div>`;

    const css = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 32px; }
      .header { text-align: center; margin-bottom: 32px; border-bottom: 3px solid #35126E; padding-bottom: 16px; }
      .header h1 { font-size: 22px; color: #35126E; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
      .header p { font-size: 11px; color: #94a3b8; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .section { margin-bottom: 28px; }
      .section-title { background: linear-gradient(135deg, #35126E, #A12AC0); color: white; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
      .section-title-badges { display: flex; gap: 6px; flex-shrink: 0; }
      .vaga-badge { font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
      .vaga-total { background: rgba(255,255,255,0.2); color: #fff; }
      .vaga-occ { background: #dcfce7; color: #16a34a; }
      .vaga-avail { background: #dbeafe; color: #2563eb; }
      .room-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin: 10px 0 6px 4px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
      th { background: #f8fafc; font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 1px; padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
      td { padding: 9px 12px; font-size: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600; }
      td.name { color: #35126E; font-weight: 700; }
      td.role { color: #64748b; font-size: 11px; }
      .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #cbd5e1; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .badge-empty { background: #fef3c7; color: #d97706; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; display: inline-block; }
    `;

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    if (reportId === 'by_house') {
      let body = summaryBox;
      houses.forEach(house => {
        const hTotal = house.rooms.reduce((s, r) => s + r.capacity, 0);
        const hOcc = house.rooms.reduce((s, r) => s + r.occupants.filter(Boolean).length, 0);
        const hAvail = hTotal - hOcc;
        body += `<div class="section">
          <div class="section-title">
            <span>${house.name}</span>
            <span class="section-title-badges">
              <span class="vaga-badge vaga-total">${hTotal} vagas</span>
              <span class="vaga-badge vaga-occ">${hOcc} ocup.</span>
              <span class="vaga-badge vaga-avail">${hAvail} livre${hAvail !== 1 ? 's' : ''}</span>
            </span>
          </div>`;
        if (house.location) body += `<p style="font-size:11px;color:#94a3b8;margin-bottom:12px;padding-left:4px;">${house.location}</p>`;
        house.rooms.forEach(room => {
          const occ = room.occupants.filter(Boolean);
          body += `<p class="room-title">${room.name} (${occ.length}/${room.capacity} vagas)</p>`;
          if (occ.length === 0) {
            body += `<p style="padding-left:4px;margin-bottom:8px;"><span class="badge-empty">Quarto vazio</span></p>`;
          } else {
            body += `<table><thead><tr><th>#</th><th>Nome</th><th>Cargo</th><th>Empresa</th></tr></thead><tbody>`;
            occ.forEach((id, idx) => {
              if (!id) return;
              const c = getCollaboratorById(id);
              body += `<tr><td style="color:#94a3b8;font-size:11px;">${idx + 1}</td><td class="name">${c?.name ?? '—'}</td><td class="role">${c?.role ?? '—'}</td><td class="role">${c?.company ?? '—'}</td></tr>`;
            });
            body += `</tbody></table>`;
          }
        });
        body += `</div>`;
      });
      return { html: wrapHtml(css, 'Relatório por Alojamento', date, body), title: 'Relatório por Alojamento' };
    }

    if (reportId === 'full_list') {
      let body = summaryBox;
      body += `<div class="section"><div class="section-title">Todos os Colaboradores</div>`;
      body += `<table><thead><tr><th>#</th><th>Nome</th><th>Cargo</th><th>Empresa</th><th>Alojamento</th></tr></thead><tbody>`;
      collaborators.forEach((c, idx) => {
        let loc = '—';
        for (const h of houses) for (const r of h.rooms) if (r.occupants.includes(c.id)) { loc = `${h.name.split(' - ')[0]} / ${r.name}`; break; }
        body += `<tr><td style="color:#94a3b8;font-size:11px;">${idx + 1}</td><td class="name">${c.name}</td><td class="role">${c.role ?? '—'}</td><td class="role">${c.company ?? '—'}</td><td class="role">${loc}</td></tr>`;
      });
      body += `</tbody></table></div>`;
      return { html: wrapHtml(css, 'Lista Geral de Colaboradores', date, body), title: 'Lista Geral de Colaboradores' };
    }

    // unallocated
    const allocatedIds = getAllocatedIds();
    const unallocated = collaborators.filter(c => !allocatedIds.has(c.id));
    let body = `<div class="section"><div class="section-title">Colaboradores sem Alojamento</div>`;
    if (unallocated.length === 0) {
      body += `<p style="text-align:center;padding:32px;color:#94a3b8;font-size:13px;font-weight:700;">Todos os colaboradores estão alocados.</p>`;
    } else {
      body += `<table><thead><tr><th>#</th><th>Nome</th><th>Cargo</th><th>Empresa</th></tr></thead><tbody>`;
      unallocated.forEach((c, idx) => {
        body += `<tr><td style="color:#94a3b8;font-size:11px;">${idx + 1}</td><td class="name">${c.name}</td><td class="role">${c.role ?? '—'}</td><td class="role">${c.company ?? '—'}</td></tr>`;
      });
      body += `</tbody></table>`;
    }
    body += `</div>`;
    return { html: wrapHtml(css, 'Colaboradores sem Alojamento', date, body), title: 'Colaboradores sem Alojamento' };
  };

  const handlePrint = (reportId: ReportType) => {
    const { html, title } = buildHtmlContent(reportId);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  const handleShare = async (reportId: ReportType) => {
    const { html, title } = buildHtmlContent(reportId);
    setProcessing('share');

    try {
      // Render HTML to a hidden div, then convert to PDF blob
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '794px'; // A4 width in px at 96dpi
      container.innerHTML = html;
      document.body.appendChild(container);

      const pdfBlob: Blob = await html2pdf()
        .set({
          margin: 0,
          filename: `${title}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .outputPdf('blob');

      document.body.removeChild(container);

      const file = new File([pdfBlob], `${title}.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
      setPendingReport(null);
    }
  };

  const handleAction = async (action: ActionType) => {
    if (!pendingReport) return;
    setProcessing(action);
    await new Promise(r => setTimeout(r, 200));
    if (action === 'print') {
      handlePrint(pendingReport);
      setProcessing(null);
      setPendingReport(null);
    } else {
      await handleShare(pendingReport);
    }
  };

  const { total, occupied, available } = getSlotStats();
  const pendingConfig = REPORTS.find(r => r.id === pendingReport);

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-8">
        <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Exportar</p>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">Relatórios</h1>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-primary-dark">{total}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Total</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-green-600">{occupied}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-green-400 mt-1">Ocupadas</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-blue-600">{available}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">Disponíveis</p>
        </div>
      </div>

      <div className="space-y-4">
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
                <report.icon size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-primary-dark text-sm uppercase tracking-tight">{report.title}</p>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">{report.description}</p>
              </div>
            </div>
            <div className="px-5 pb-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPendingReport(report.id)}
                className={`w-full bg-gradient-to-r ${report.color} text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-opacity`}
              >
                <Printer size={16} /> Gerar Relatório
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
          Imprima ou compartilhe o relatório diretamente como PDF
        </p>
      </div>

      {/* Bottom Sheet de ação */}
      <AnimatePresence>
        {pendingReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[100] flex items-end justify-center"
            onClick={() => { if (!processing) setPendingReport(null); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-t-[40px] p-8"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">Relatório</p>
                  <h2 className="text-xl font-black text-primary-dark uppercase tracking-tight">{pendingConfig?.title}</h2>
                </div>
                <button
                  onClick={() => { if (!processing) setPendingReport(null); }}
                  className="text-slate-300 hover:text-slate-400 transition-colors p-1"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-400 mb-6 leading-relaxed">
                Como deseja exportar este relatório?
              </p>

              <div className="space-y-3">
                {/* Imprimir */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAction('print')}
                  disabled={!!processing}
                  className="w-full bg-slate-50 border border-slate-100 text-primary-dark py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-opacity"
                >
                  {processing === 'print' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Printer size={18} />
                  )}
                  Imprimir / Salvar PDF
                </motion.button>

                {/* Compartilhar */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAction('share')}
                  disabled={!!processing}
                  className={`w-full bg-gradient-to-r ${pendingConfig?.color} text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 transition-opacity`}
                >
                  {processing === 'share' ? (
                    <><Loader2 size={18} className="animate-spin" /> Gerando PDF...</>
                  ) : (
                    <><Share2 size={18} /> Compartilhar PDF</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function wrapHtml(css: string, title: string, date: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>${title} - Alojador LT</title>
  <style>${css}</style>
</head>
<body>
  <div class="header">
    <h1>Alojador LT</h1>
    <p>${title} — Emitido em ${date}</p>
  </div>
  ${body}
  <div class="footer">Alojador LT • Gerenciamento de Alojamentos para Linha de Transmissão • Desenvolvido por Moisés Honorato</div>
</body>
</html>`;
}
