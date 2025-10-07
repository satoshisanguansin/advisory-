import React, { useState, useEffect } from 'react';

interface ContributionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newContent: string) => void;
  initialContent: string;
  sectionTitle: string;
}

const ContributionEditor: React.FC<ContributionEditorProps> = ({ isOpen, onClose, onSave, initialContent, sectionTitle }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#2a2f34] rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-zinc-700" onClick={e => e.stopPropagation()}>
        <h4 className="text-xl font-bold text-white mb-4">แก้ไขเนื้อหาสำหรับ: <span className="text-yellow-400">{sectionTitle}</span></h4>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full bg-[#212529] border border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
            placeholder="เพิ่มบันทึก, การวิเคราะห์, หรือข้อมูลเพิ่มเติมที่นี่..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
            ยกเลิก
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold transition-colors">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionEditor;
