document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const calc = () => {
    const purchaseExclVAT = parseFloat($('purchasePrice').value) || 0; // kullanıcının girdiği alış (KDV hariç)
    const saleInclVAT = parseFloat($('salePrice').value) || 0; // satış KDV dahil girilecek
    const shippingCharged = 0; // müşteri kargo ödemiyor
    const shippingCost = 100; // sabit satıcı kargo maliyeti (TL)
    const commissionPercent = parseFloat($('commissionPercent').value) || 0; // örn 21.5
    const commissionVatPercent = parseFloat($('commissionVatPercent').value) || 0; // örn 20
    const productVatPercent = parseFloat($('productVatPercent').value) || 0; // örn 10

    // Helper: 2 ondalık yuvarlama
    const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;

    // 1) Gerçek Alış Maliyeti (KDV dahil)
    let purchaseVat = purchaseExclVAT * (productVatPercent / 100);
    purchaseVat = round2(purchaseVat);
    let purchaseInclVAT = round2(purchaseExclVAT + purchaseVat);

    // 2) Satış geliri ve doğrudan maliyetler
    const revenue = saleInclVAT + shippingCharged; // müşteriden gelen toplam (KDV dahil)
    const preCommissionRemaining = revenue - purchaseInclVAT - shippingCost;

    // 3) Trendyol komisyonu ve komisyon KDV'si
    // Komisyon brüt satış üzerinden (kullanıcının istediği gibi)
    const commissionBase = saleInclVAT; // örnekte komisyon brüt satıştan
    let commission = commissionBase * (commissionPercent / 100);
    commission = round2(commission);
    let commissionVat = commission * (commissionVatPercent / 100);
    commissionVat = round2(commissionVat);
    const totalCommissionTaken = round2(commission + commissionVat);

    // 4) Net kâr
    const profit = preCommissionRemaining - totalCommissionTaken;
    const margin = saleInclVAT ? (profit / saleInclVAT) * 100 : 0;

    // Hazırla: adım adım metin
    const breakdownLines = [];
    breakdownLines.push('<h4>1. Adım: Gerçek Alış Maliyeti (KDV Dahil)</h4>');
    breakdownLines.push(`<div class="row">KDV Hariç Alış Fiyatı: <strong>${purchaseExclVAT.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Ürünün KDV'si (${productVatPercent}%): <strong>${purchaseVat.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">KDV Dahil Alış Fiyatı: <strong>${purchaseInclVAT.toFixed(2)} TL</strong></div>`);

    breakdownLines.push('<h4>2. Adım: Satış Geliri ve Doğrudan Maliyetler</h4>');
    breakdownLines.push(`<div class="row">Trendyol Satış Fiyatı (KDV dahil): <strong>+${saleInclVAT.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Gerçek Alış Maliyeti (KDV dahil): <strong>-${purchaseInclVAT.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Kargo Ücreti (satıcı öder - sabit): <strong>-${shippingCost.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row"><strong>Elde Kalan (Komisyon Öncesi Tutar): ${preCommissionRemaining.toFixed(2)} TL</strong></div>`);

    breakdownLines.push('<h4>3. Adım: Trendyol Komisyon Kesintisi</h4>');
    breakdownLines.push(`<div class="row">Yalın Komisyon (${commissionPercent}% of ${commissionBase.toFixed(2)}): <strong>${commission.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Komisyonun KDV'si (${commissionVatPercent}%): <strong>${commissionVat.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Trendyol'un Toplam Keseceği Tutar: <strong>${totalCommissionTaken.toFixed(2)} TL</strong></div>`);

    breakdownLines.push('<h4>4. Adım: Net Kâr</h4>');
    breakdownLines.push(`<div class="row">Komisyon Öncesi Tutar: <strong>${preCommissionRemaining.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row">Trendyol Toplam Kesinti: <strong>-${totalCommissionTaken.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row"><strong>Net Kâr: ${profit.toFixed(2)} TL</strong></div>`);
    breakdownLines.push(`<div class="row"><strong>Kâr Marjı (satış bazlı): ${margin.toFixed(2)} %</strong></div>`);

    $('breakdown').innerHTML = breakdownLines.join('');

    // Modal detay
    const modalLines = [];
    modalLines.push('<ol>');
    modalLines.push('<li>Gerçek Alış Maliyeti (KDV Dahil):');
    modalLines.push(`<p>${purchaseExclVAT.toFixed(2)} + ${purchaseVat.toFixed(2)} = <strong>${purchaseInclVAT.toFixed(2)} TL</strong></p>`);
    modalLines.push('</li>');
    modalLines.push('<li>Satış Geliri ve Doğrudan Maliyetler:');
    modalLines.push(`<p>${saleInclVAT.toFixed(2)} - ${purchaseInclVAT.toFixed(2)} - ${shippingCost.toFixed(2)} = <strong>${preCommissionRemaining.toFixed(2)} TL</strong></p>`);
    modalLines.push('</li>');
    modalLines.push('<li>Trendyol Komisyonu:');
    modalLines.push(`<p>Komisyon: ${commissionBase.toFixed(2)} × ${commissionPercent}% = <strong>${commission.toFixed(2)} TL</strong></p>`);
    modalLines.push(`<p>Komisyon KDV: ${commission.toFixed(2)} × ${commissionVatPercent}% = <strong>${commissionVat.toFixed(2)} TL</strong></p>`);
    modalLines.push(`<p>Toplam: <strong>${totalCommissionTaken.toFixed(2)} TL</strong></p>`);
    modalLines.push('</li>');
    modalLines.push('<li>Net Kâr:');
    modalLines.push(`<p>${preCommissionRemaining.toFixed(2)} - ${totalCommissionTaken.toFixed(2)} = <strong>${profit.toFixed(2)} TL</strong></p>`);
    modalLines.push('</li>');
    modalLines.push('</ol>');

    $('modalContent').innerHTML = modalLines.join('');
    const modal = document.getElementById('resultModal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  };

  $('calcBtn').addEventListener('click', calc);
  document.getElementById('calcForm').addEventListener('submit', e => e.preventDefault());

  // Modal kapatma davranışları
  const modal = document.getElementById('resultModal');
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
    // Ensure reset button clears displayed results and restores disabled values
    const form = document.getElementById('calcForm');
    form.addEventListener('reset', () => {
      // restore disabled/constant fields
      const shippingChargedInput = document.getElementById('shippingCharged');
      const shippingCostInput = document.getElementById('shippingCost');
      if (shippingChargedInput) shippingChargedInput.value = '0';
      if (shippingCostInput) shippingCostInput.value = '100';

      // clear result area and modal
      const breakdown = document.getElementById('breakdown');
      if (breakdown) breakdown.innerHTML = '';
      if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
});
