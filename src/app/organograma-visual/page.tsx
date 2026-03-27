'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, ZoomIn, ZoomOut, Plus, X, Printer } from 'lucide-react';

interface NodeData {
  id: string;
  title: string;
  name: string;
  style: 'assembly' | 'council' | 'executive' | 'legal' | 'dept' | 'sub';
  comment?: string;
}

export default function OrganogramaVisualPage() {
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState<Record<string, NodeData>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('organograma-i10-visual');
    if (saved) {
      try {
        setNodes(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  const saveNodes = (newNodes: Record<string, NodeData>) => {
    setNodes(newNodes);
    localStorage.setItem('organograma-i10-visual', JSON.stringify(newNodes));
  };

  const updateNodeComment = (nodeId: string, newComment: string) => {
    const updated = { ...nodes };
    if (updated[nodeId]) {
      updated[nodeId].comment = newComment;
    }
    saveNodes(updated);
  };

  const handleExport = () => {
    const json = JSON.stringify(nodes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organograma-i10-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          saveNodes(data);
          alert('Dados importados com sucesso!');
        } catch (err) {
          alert('Erro ao importar arquivo');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1a5276] to-[#2980b9] text-white p-6 sm:p-8 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Organograma - Instituto i10</h1>
          <p className="text-blue-100">Estrutura Organizacional ICT | Edifício Corporativo Softplan, Sapiens Park</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-b border-slate-200 p-4 sm:p-6 shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 1.5))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2980b9] text-white hover:bg-[#1a6da0] transition-colors font-medium text-sm"
          >
            <ZoomIn size={18} /> Zoom +
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2980b9] text-white hover:bg-[#1a6da0] transition-colors font-medium text-sm"
          >
            <ZoomOut size={18} /> Zoom -
          </button>
          <button
            onClick={() => setZoom(1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-300 text-slate-700 hover:bg-slate-400 transition-colors font-medium text-sm"
          >
            Reset
          </button>

          <div className="w-full sm:w-auto flex-1 sm:flex-initial" />

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#27ae60] text-white hover:bg-[#1e8449] transition-colors font-medium text-sm"
          >
            <Download size={18} /> Exportar
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#27ae60] text-white hover:bg-[#1e8449] transition-colors font-medium text-sm"
          >
            <Upload size={18} /> Importar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e67e22] text-white hover:bg-[#d35400] transition-colors font-medium text-sm"
          >
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </motion.div>

      {/* Main Chart Area */}
      <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-200px)] flex items-start justify-center p-8">
        <motion.div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="min-w-max"
        >
          <div className="space-y-12">
            {/* ====== LEVEL 1: ASSEMBLEIA ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <OrganogNode
                title="Assembleia Geral"
                name="Órgão Máximo de Deliberação"
                style="assembly"
                nodeId="assembleia"
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />

              <div className="flex gap-8 text-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-w-[180px]">
                  <strong className="text-blue-900 block mb-2">Mesa da Assembleia</strong>
                  <div className="text-blue-700 space-y-1 text-xs">
                    <div>Pres.: <span className="font-semibold">Enio</span> <span className="text-red-500">*</span></div>
                    <div>Vice: <span className="font-semibold">B.Q.</span> <span className="text-red-500">?</span></div>
                    <div>Sec.: <span className="font-semibold">Gustavo</span></div>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-w-[220px]">
                  <strong className="text-slate-900 block mb-2">Associados (Fundadores)</strong>
                  <div className="text-slate-600 text-xs space-y-1">
                    <div>BQ • Mercia • Gustavo</div>
                    <div>B.Almeida • Emerson • Enio</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vertical line */}
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full" />
            </div>

            {/* ====== LEVEL 2: COUNCILS ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-24"
            >
              <OrganogNode
                title="Conselho Fiscal"
                name="Emerson / Gustavo"
                style="council"
                nodeId="conselho-fiscal"
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />
              <div className="w-1 h-24 bg-slate-300" />
              <OrganogNode
                title="Conselho de Notáveis"
                name="A definir"
                style="advisory"
                nodeId="conselho-notaveis"
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />
            </motion.div>

            {/* Vertical line */}
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full" />
            </div>

            {/* ====== LEVEL 3: DIRETORIA EXECUTIVA ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-8"
            >
              <OrganogNode
                title="Diretoria Executiva"
                name="Enio (Raphael)"
                style="executive"
                nodeId="diretoria"
                subtitle="*Regimento Interno"
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />
              <div className="w-16 h-1 bg-slate-400" />
              <OrganogNode
                title="Jurídico"
                name="Mercia"
                style="legal"
                nodeId="juridico"
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />
            </motion.div>

            {/* Vertical line */}
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full" />
            </div>

            {/* Horizontal connector line for departments */}
            <div className="flex justify-center px-8">
              <div className="w-96 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            </div>

            {/* ====== LEVEL 4: DEPARTMENTS ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-16 justify-center"
            >
              {/* TECNOLOGIA */}
              <DepartmentColumn
                deptTitle="Tecnologia"
                deptLead="B. Almeida"
                deptId="tecnologia"
                subItems={[
                  { id: 'tec-sc', title: 'SC', name: '1-2' },
                  { id: 'tec-sp', title: 'SP', name: '2' },
                ]}
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />

              {/* OPERACOES */}
              <DepartmentColumn
                deptTitle="Operações"
                deptLead="Gustavo"
                deptId="operacoes"
                subItems={[
                  { id: 'ops-sc', title: 'SC - Campo/Logística', name: 'Agente Local' },
                  { id: 'ops-sp', title: 'SP', name: '1' },
                ]}
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />

              {/* PEDAGOGICO */}
              <DepartmentColumn
                deptTitle="Pedagógico"
                deptLead="A definir"
                deptId="pedagogico"
                isUndefined
                subItems={[
                  { id: 'ped-sc', title: 'SC', name: '1' },
                  { id: 'ped-sp', title: 'SP', name: '1' },
                ]}
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
                onCommentChange={updateNodeComment}
                nodes={nodes}
              />
            </motion.div>

            {/* Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white border-l-4 border-red-500 rounded-lg p-6 max-w-2xl mx-auto shadow-sm"
            >
              <h3 className="text-red-700 font-bold mb-4">Observações</h3>
              <ul className="text-sm text-slate-600 space-y-3">
                <li>
                  <span className="text-red-500 font-bold">*</span> Regimento Interno necessário para evitar conflito de interesses (Presidente + Diretor Executivo)
                </li>
                <li>
                  <span className="text-red-500 font-bold">?</span> Posições a confirmar na próxima assembleia
                </li>
                <li>
                  <strong>SC</strong> = Santa Catarina | <strong>SP</strong> = São Paulo
                </li>
                <li>
                  <strong>Tipos de Associados:</strong> Fundadores, Contribuintes, Benfeitor, Honorário
                </li>
                <li>
                  <strong>Escritório:</strong> Edifício Corporativo Softplan, Sapiens Park, Av. Luiz Boiteux Piazza, 1302, Canasvieiras, Florianópolis/SC
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && nodes[selectedNode] && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl border-l border-slate-200 p-6 overflow-y-auto z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Detalhes</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedNode && nodes[selectedNode] && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Cargo</label>
                    <p className="text-slate-900 font-semibold">{nodes[selectedNode].title}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Responsável</label>
                    <p className="text-slate-900 font-semibold">{nodes[selectedNode].name}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tipo</label>
                    {(() => {
                      const style = nodes[selectedNode].style as string;
                      const styleMap: Record<string, string> = {
                        assembly: 'bg-blue-100 text-blue-700',
                        executive: 'bg-red-100 text-red-700',
                        council: 'bg-yellow-100 text-yellow-700',
                        advisory: 'bg-purple-100 text-purple-700',
                        legal: 'bg-green-100 text-green-700',
                        dept: 'bg-blue-100 text-blue-700',
                        sub: 'bg-slate-100 text-slate-700',
                      };
                      const bgClass = styleMap[style] || 'bg-slate-100 text-slate-700';
                      
                      return (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgClass}`}>
                          {style.toUpperCase()}
                        </span>
                      );
                    })()}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Comentários</label>
                <textarea
                  value={nodes[selectedNode]?.comment || ''}
                  onChange={(e) => updateNodeComment(selectedNode, e.target.value)}
                  placeholder="Adicione observações..."
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Component: Organization Node
interface OrganogNodeProps {
  title: string;
  name: string;
  style: string;
  nodeId: string;
  subtitle?: string;
  selectedNode: string | null;
  onSelect: (id: string) => void;
  onCommentChange: (id: string, comment: string) => void;
  nodes: Record<string, NodeData>;
}

function OrganogNode({
  title,
  name,
  style,
  nodeId,
  subtitle,
  selectedNode,
  onSelect,
  onCommentChange,
  nodes,
}: OrganogNodeProps) {
  const getStyleClass = (s: string): string => {
    const styles: Record<string, string> = {
      assembly: 'bg-gradient-to-br from-[#1a5276] to-[#2471a3] border-[#1a5276] text-white',
      executive: 'bg-gradient-to-br from-[#c0392b] to-[#e74c3c] border-[#c0392b] text-white',
      council: 'bg-gradient-to-br from-[#d4ac0d] to-[#f1c40f] border-[#d4ac0d] text-gray-800',
      advisory: 'bg-gradient-to-br from-[#8e44ad] to-[#a569bd] border-[#8e44ad] text-white',
      legal: 'bg-gradient-to-br from-[#117a65] to-[#1abc9c] border-[#117a65] text-white',
      dept: 'bg-white border-[#2e86c1] text-slate-900 shadow-md',
      sub: 'bg-slate-50 border-slate-300 text-slate-800',
    };
    return styles[s] || 'bg-white border-slate-300 text-slate-900';
  };

  const isSelected = selectedNode === nodeId;

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(nodeId)}
      className={`
        relative p-5 rounded-xl border-2 min-w-[180px] transition-all
        ${getStyleClass(style)}
        ${isSelected ? 'ring-4 ring-amber-400 shadow-2xl' : 'shadow-lg'}
        hover:shadow-xl
      `}
    >
      <div className="text-left">
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
          style === 'dept' || style === 'sub' ? 'text-slate-500' : 'opacity-75'
        }`}>
          {title}
        </div>
        <div className={`text-sm font-bold ${
          style === 'dept' || style === 'sub' ? 'text-blue-600' : 'text-current'
        }`}>
          {name}
        </div>
        {subtitle && (
          <div className={`text-xs mt-1 ${
            style === 'executive' ? 'text-red-100' : 'text-current opacity-70'
          }`}>
            {subtitle}
          </div>
        )}
      </div>

      {nodes[nodeId]?.comment && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900">
          💬
        </div>
      )}
    </motion.button>
  );
}

// Component: Department Column
interface DepartmentColumnProps {
  deptTitle: string;
  deptLead: string;
  deptId: string;
  isUndefined?: boolean;
  subItems: Array<{ id: string; title: string; name: string }>;
  selectedNode: string | null;
  onSelect: (id: string) => void;
  onCommentChange: (id: string, comment: string) => void;
  nodes: Record<string, NodeData>;
}

function DepartmentColumn({
  deptTitle,
  deptLead,
  deptId,
  isUndefined,
  subItems,
  selectedNode,
  onSelect,
  onCommentChange,
  nodes,
}: DepartmentColumnProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <OrganogNode
        title={deptTitle}
        name={deptLead}
        style="dept"
        nodeId={deptId}
        selectedNode={selectedNode}
        onSelect={onSelect}
        onCommentChange={onCommentChange}
        nodes={nodes}
      />

      {/* Vertical connector */}
      <div className="w-1 h-6 bg-slate-400 rounded-full" />

      {/* Sub items */}
      <div className="space-y-4">
        {subItems.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <OrganogNode
              title={item.title}
              name={item.name}
              style="sub"
              nodeId={item.id}
              selectedNode={selectedNode}
              onSelect={onSelect}
              onCommentChange={onCommentChange}
              nodes={nodes}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
