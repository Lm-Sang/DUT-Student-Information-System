import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
const server = await createServer({ server: { middlewareMode: true } });
try {
  const { requestTypes, workflows, statusLabels } = await server.ssrLoadModule(
    '/src/features/services/data/requestCatalog.ts',
  );
  const lines = [
    '# Ma trận thủ tục đang triển khai',
    '',
    'Sinh từ `requestCatalog.ts` và `procedurePolicy.ts` bằng `node scripts/export-procedure-matrix.mjs`. Cấu hình demo; các kênh, phí, thời hạn và điều kiện cần DUT xác nhận trước khi triển khai thực tế.',
    '',
    '| ID / thủ tục | Nhóm / chủ trì | Nộp / minh chứng / xử lý | Kết quả / kênh trả | Yêu cầu bản ghi |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const t of requestTypes) {
    const flags =
      [
        [t.requiresOriginalVerification, 'Đối chiếu gốc'],
        [t.requiresApprovalRecord, 'Phê duyệt'],
        [t.requiresSignatureRecord, 'Ký ngoài hệ thống'],
        [t.requiresSealRecord, 'Dấu ngoài hệ thống'],
        [t.requiresPickup, 'Nhận trực tiếp'],
        [t.requiresCampaign, 'Theo đợt'],
      ]
        .filter(([on]) => on)
        .map(([, label]) => label)
        .join('; ') || 'Theo phiếu xử lý';
    const result =
      t.workflow === 'document'
        ? 'Văn bản có xác nhận; scan tham khảo'
        : t.workflow === 'card'
          ? 'Thẻ được đơn vị ngoài sản xuất'
          : t.workflow === 'support'
            ? 'Hướng dẫn / phản hồi khôi phục'
            : 'Quyết định / thông báo / ghi nhận cập nhật';
    lines.push(
      `| \`${t.id}\` · ${t.name} | ${t.category} / ${t.department} | ${t.submissionMode} / ${t.evidenceMode} / ${t.processingMode} | ${result} / ${t.resultDeliveryMode} | ${flags} |`,
    );
  }
  lines.push('', '## Các quy trình', '');
  for (const [key, steps] of Object.entries(workflows))
    lines.push(`- **${key}**: ${steps.map((step) => statusLabels[step]).join(' → ')}.`);
  lines.push(
    '',
    'Bổ sung và từ chối là nhánh có lý do ở bước kiểm tra/xét hợp lệ; bổ sung quay về đúng bước đã tạm dừng. Hủy chỉ trước tiếp nhận. Admin không chuyển bước nghiệp vụ.',
    '',
    'Không tự tính điểm, tạo chữ ký/con dấu, thay đổi tài khoản thật hoặc cập nhật học vụ thật. Tất cả thao tác bên ngoài chỉ ghi nhận kết quả đã thực hiện, kèm tham chiếu và xác nhận của chuyên viên.',
    '',
  );
  await writeFile('docs/procedure-matrix.md', lines.join('\n'));
  console.log(
    `Exported ${requestTypes.length} procedures and ${Object.keys(workflows).length} workflows.`,
  );
} finally {
  await server.close();
}
