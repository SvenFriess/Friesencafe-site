import React, { useEffect, useMemo, useState } from "react";

// Friesen‑Café Status Portal (Single‑File React App)
// Styling: Tailwind utility classes (no setup needed in Canvas)
// Data model persists to localStorage for quick edits during demo.
// In production, replace localStorage with a small JSON file in your repo (content.json)
// or a tiny backend (e.g., FastAPI/Flask) that serves/accepts updates.

const LS_KEY = "friesencafe_data_v1";

const initialData = {
  siteTitle: "Friesen‑Café Statusportal",
  heroTagline: "Immer der aktuellste Stand – Dokumente, Beschlüsse, Nächste Schritte.",
  lastUpdatedISO: new Date().toISOString(),
  status: [
    {
      date: new Date().toISOString().slice(0, 10),
      title: "Kickoff der Status‑Site",
      body: "Dieses Portal bündelt ab heute alle Updates, Entscheidungen und Anhänge zum Friesen‑Café.",
      labels: ["Info", "Start"]
    }
  ],
  nextActions: [
    { text: "Gesprächsprotokoll 06.10. hochladen", owner: "Sven", due: null },
    { text: "Behördenrückmeldung dokumentieren", owner: "Katja", due: null },
  ],
  documents: [
    {
      date: new Date().toISOString().slice(0, 10),
      title: "Protokoll: Gespräch Katja & Merle & Silke (06.10)",
      type: "Protokoll",
      url: "#",
      notes: "Erster Upload – Platzhalter. Link später ersetzen."
    }
  ],
  changelog: [
    { ts: new Date().toISOString(), note: "v1 erstellt (Single‑File React)." }
  ]
};

function usePortalData() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : initialData;
    } catch (_) {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (_) {}
  }, [data]);

  const touchUpdated = () =>
    setData((d) => ({ ...d, lastUpdatedISO: new Date().toISOString() }));

  return { data, setData, touchUpdated };
}

function Pill({ children }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">{children}</span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function Header({ title, subtitle, lastUpdatedISO }) {
  const lastUpdated = useMemo(() => new Date(lastUpdatedISO), [lastUpdatedISO]);
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        <div className="text-xs text-gray-500">Letztes Update: {lastUpdated.toLocaleString()}</div>
      </div>
      {subtitle && (
        <p className="text-gray-600 mt-2">{subtitle}</p>
      )}
    </header>
  );
}

function SectionTitle({ children, right = null }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">{children}</h2>
      {right}
    </div>
  );
}

function StatusList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((s, i) => (
        <Card key={i}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">{s.date}</div>
              <div className="font-medium mt-1">{s.title}</div>
              {s.body && <p className="text-gray-600 mt-2 text-sm leading-relaxed">{s.body}</p>}
              {s.labels?.length ? (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {s.labels.map((l, j) => (
                    <Pill key={j}>{l}</Pill>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function NextActions({ items, onAdd }) {
  const [text, setText] = useState("");
  const [owner, setOwner] = useState("");
  return (
    <Card>
      <SectionTitle right={
        <div className="flex gap-2">
          <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Aufgabe…" value={text} onChange={(e)=>setText(e.target.value)} />
          <input className="border rounded-xl px-3 py-2 text-sm w-28" placeholder="Owner" value={owner} onChange={(e)=>setOwner(e.target.value)} />
          <button className="rounded-xl px-3 py-2 text-sm border bg-gray-50 hover:bg-gray-100" onClick={()=>{ if(!text) return; onAdd({ text, owner: owner || null, due: null }); setText(""); setOwner(""); }}>Hinzufügen</button>
        </div>
      }>
        Nächste Schritte
      </SectionTitle>
      <ul className="list-disc pl-5 space-y-2">
        {items.map((a, i) => (
          <li key={i} className="text-sm">
            <span className="font-medium">{a.text}</span>
            {a.owner && <span className="text-gray-500"> · {a.owner}</span>}
            {a.due && <span className="text-gray-500"> · fällig {a.due}</span>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Documents({ items, onAdd }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Protokoll");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Card>
      <SectionTitle right={
        <div className="flex flex-wrap gap-2">
          <input className="border rounded-xl px-3 py-2 text-sm w-48" placeholder="Titel" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input className="border rounded-xl px-3 py-2 text-sm w-32" placeholder="Typ" value={type} onChange={(e)=>setType(e.target.value)} />
          <input className="border rounded-xl px-3 py-2 text-sm w-64" placeholder="URL (z.B. GitHub, Cloudflare, Google Drive)" value={url} onChange={(e)=>setUrl(e.target.value)} />
          <input className="border rounded-xl px-3 py-2 text-sm w-64" placeholder="Notiz (optional)" value={notes} onChange={(e)=>setNotes(e.target.value)} />
          <button className="rounded-xl px-3 py-2 text-sm border bg-gray-50 hover:bg-gray-100" onClick={()=>{ if(!title || !url) return; onAdd({ date: new Date().toISOString().slice(0,10), title, type, url, notes: notes || null }); setTitle(""); setType("Protokoll"); setUrl(""); setNotes(""); }}>Anhängen</button>
        </div>
      }>
        Dokumente (fortlaufend anhängen)
      </SectionTitle>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-3">Datum</th>
              <th className="py-2 pr-3">Titel</th>
              <th className="py-2 pr-3">Typ</th>
              <th className="py-2 pr-3">Link</th>
              <th className="py-2 pr-3">Notiz</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 pr-3 whitespace-nowrap">{d.date}</td>
                <td className="py-2 pr-3 font-medium">{d.title}</td>
                <td className="py-2 pr-3">{d.type}</td>
                <td className="py-2 pr-3 text-blue-600 underline"><a href={d.url} target="_blank" rel="noreferrer">Öffnen</a></td>
                <td className="py-2 pr-3 text-gray-600">{d.notes || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Changelog({ items }) {
  return (
    <Card>
      <SectionTitle>Änderungsprotokoll</SectionTitle>
      <ul className="space-y-2 text-sm">
        {items.map((c, i) => (
          <li key={i} className="text-gray-700">
            <span className="text-gray-500">{new Date(c.ts).toLocaleString()}:</span> {c.note}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Toolbar({ data, onExport, onReset, editMode, setEditMode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="rounded-xl border px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100" onClick={onExport}>Export JSON</button>
      <button className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50" onClick={onReset}>Reset (Demo‑Daten)</button>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={editMode} onChange={(e)=>setEditMode(e.target.checked)} /> Edit‑Modus
      </label>
      <div className="text-xs text-gray-500">Einträge: Status {data.status.length} · Docs {data.documents.length} · Nächste Schritte {data.nextActions.length}</div>
    </div>
  );
}

export default function App() {
  const { data, setData, touchUpdated } = usePortalData();
  const [editMode, setEditMode] = useState(true);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `friesencafe-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    localStorage.removeItem(LS_KEY);
    window.location.reload();
  };

  const addStatus = (s) => {
    if (!editMode) return;
    setData((d) => ({
      ...d,
      status: [{ ...s }, ...d.status],
      changelog: [{ ts: new Date().toISOString(), note: `Status hinzugefügt: ${s.title}` }, ...d.changelog]
    }));
    touchUpdated();
  };

  const addAction = (a) => {
    if (!editMode) return;
    setData((d) => ({
      ...d,
      nextActions: [{ ...a }, ...d.nextActions],
      changelog: [{ ts: new Date().toISOString(), note: `Aufgabe hinzugefügt: ${a.text}` }, ...d.changelog]
    }));
    touchUpdated();
  };

  const addDocument = (doc) => {
    if (!editMode) return;
    setData((d) => ({
      ...d,
      documents: [{ ...doc }, ...d.documents],
      changelog: [{ ts: new Date().toISOString(), note: `Dokument angehängt: ${doc.title}` }, ...d.changelog]
    }));
    touchUpdated();
  };

  const [newStatus, setNewStatus] = useState({ date: new Date().toISOString().slice(0, 10), title: "", body: "", labels: [] });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-5 md:p-8">
        <Header title={data.siteTitle} subtitle={data.heroTagline} lastUpdatedISO={data.lastUpdatedISO} />

        <div className="mb-6">
          <Toolbar data={data} onExport={exportJson} onReset={resetData} editMode={editMode} setEditMode={setEditMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <SectionTitle>Aktueller Stand / Update posten</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input className="border rounded-xl px-3 py-2 text-sm md:col-span-1" value={newStatus.date} onChange={(e)=>setNewStatus({...newStatus, date: e.target.value})} />
                <input className="border rounded-xl px-3 py-2 text-sm md:col-span-3" placeholder="Überschrift" value={newStatus.title} onChange={(e)=>setNewStatus({...newStatus, title: e.target.value})} />
                <textarea className="border rounded-xl px-3 py-2 text-sm md:col-span-4" rows={3} placeholder="Kurztext (optional)" value={newStatus.body} onChange={(e)=>setNewStatus({...newStatus, body: e.target.value})}></textarea>
                <div className="md:col-span-4 flex gap-2 justify-end">
                  <button className="rounded-xl border px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100" onClick={()=>{ if(!newStatus.title) return; addStatus(newStatus); setNewStatus({ date: new Date().toISOString().slice(0,10), title: "", body: "", labels: [] }); }}>Veröffentlichen</button>
                </div>
              </div>
            </Card>

            <StatusList items={data.status} />
          </div>

          <div className="space-y-6">
            <NextActions items={data.nextActions} onAdd={addAction} />
            <Documents items={data.documents} onAdd={addDocument} />
            <Changelog items={data.changelog} />
          </div>
        </div>

        <footer className="text-xs text-gray-500 mt-10">
          <div>Friesen‑Café Statusportal • v1 • Ein‑Datei‑App • Für Produktion: content.json + CI‑Deploy (z. B. GitHub Pages/Cloudflare Pages).</div>
        </footer>
      </div>
    </div>
  );
}
