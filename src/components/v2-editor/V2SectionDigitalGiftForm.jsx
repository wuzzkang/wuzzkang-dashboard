import React from 'react';

export function V2SectionDigitalGiftForm({
  section,
  handleUpdateSectionContent,
  renderSectionStylePicker,
  renderAIV2Button
}) {
  return (
    <div className="space-y-3">
      {renderSectionStylePicker(section)}
      <div className="flex justify-between items-center">
        <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider">Amplop Digital & QRIS</label>
        {renderAIV2Button(section.id, 'digital_gift')}
      </div>
      <input
        type="text"
        value={section.content.title || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { title: e.target.value })}
        placeholder="Amplop Digital & Tanda Kasih..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />
      <input
        type="text"
        value={section.content.rsvp_whatsapp || ''}
        onChange={(e) => handleUpdateSectionContent(section.id, { rsvp_whatsapp: e.target.value })}
        placeholder="No. WhatsApp RSVP (e.g. 6281234567890)..."
        className="block w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none"
      />

      {/* Bank Accounts List */}
      <div className="space-y-2 pt-2 border-t border-theme-border/60">
        <div className="flex justify-between items-center">
          <label className="block text-[9px] font-bold text-theme-accent uppercase tracking-wider">Daftar Rekening Bank ({(section.content.bank_accounts || []).length})</label>
          <button
            type="button"
            onClick={() => {
              const currentList = [...(section.content.bank_accounts || [])];
              currentList.push({ bank_name: 'Bank BCA', account_number: '', account_holder: '' });
              handleUpdateSectionContent(section.id, { bank_accounts: currentList });
            }}
            className="text-[9px] font-bold text-theme-accent hover:underline flex items-center gap-1"
          >
            + Tambah Rekening
          </button>
        </div>

        {(section.content.bank_accounts || []).map((acc, accIdx) => (
          <div key={accIdx} className="p-2.5 bg-theme-bg/60 border border-theme-border/70 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-theme-text-sec">Rekening #{accIdx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const currentList = [...(section.content.bank_accounts || [])];
                  currentList.splice(accIdx, 1);
                  handleUpdateSectionContent(section.id, { bank_accounts: currentList });
                }}
                className="text-red-400 hover:text-red-300 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={acc.bank_name || ''}
                onChange={(e) => {
                  const currentList = [...(section.content.bank_accounts || [])];
                  currentList[accIdx] = { ...currentList[accIdx], bank_name: e.target.value };
                  handleUpdateSectionContent(section.id, { bank_accounts: currentList });
                }}
                placeholder="Bank BCA"
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
              <input
                type="text"
                value={acc.account_number || ''}
                onChange={(e) => {
                  const currentList = [...(section.content.bank_accounts || [])];
                  currentList[accIdx] = { ...currentList[accIdx], account_number: e.target.value };
                  handleUpdateSectionContent(section.id, { bank_accounts: currentList });
                }}
                placeholder="No. Rekening..."
                className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
              />
            </div>
            <input
              type="text"
              value={acc.account_holder || ''}
              onChange={(e) => {
                const currentList = [...(section.content.bank_accounts || [])];
                currentList[accIdx] = { ...currentList[accIdx], account_holder: e.target.value };
                handleUpdateSectionContent(section.id, { bank_accounts: currentList });
              }}
              placeholder="Nama Pemilik Rekening..."
              className="block w-full px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
