import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function login(page: Page, account: string, route: string) {
  await page.goto(route);
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill(account);
  await page
    .getByLabel('Mật khẩu', { exact: true })
    .fill(
      account.startsWith('staff')
        ? 'staff123'
        : account.startsWith('admin')
          ? 'admin123'
          : 'student123',
    );
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(route.replace('?', '\\?') + '$'));
}
async function advance(page: Page, status: string, message: string) {
  await page.getByLabel('Bước xử lý tiếp theo').selectOption(status);
  await page.getByLabel('Phản hồi cho sinh viên', { exact: true }).fill(message);
  const confirmation = page.getByLabel('Xác nhận thao tác bên ngoài đã thực hiện', {
    exact: false,
  });
  if (await confirmation.isVisible()) await confirmation.check();
  await page.getByRole('button', { name: 'Cập nhật trạng thái', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Xác nhận cập nhật', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Đã cập nhật trạng thái');
}
async function assign(
  page: Page,
  staff = 'u-staff-1',
  note = 'Kiểm tra hồ sơ theo đơn vị phụ trách.',
) {
  await page.getByLabel('Chuyên viên phụ trách').selectOption(staff);
  await page.getByLabel('Hạn xử lý', { exact: true }).fill('2099-01-01');
  await page.getByLabel('Nội dung phân công', { exact: false }).fill(note);
  await page.getByRole('button', { name: 'Lưu phân công' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Xác nhận phân công', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
async function newDocument(page: Page, type = 'full-transcript') {
  await page.getByLabel('Loại đơn đề nghị:').selectOption(type);
  if (type === 'student-confirmation')
    await page.getByLabel('Nội dung đề nghị:').fill('Hồ sơ thực tập');
  await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
  await page.getByRole('button', { name: 'Xác nhận nộp', exact: true }).click();
  const button = page.getByRole('button', { name: /^YC-\d{4}-/ }).first();
  await expect(button).toBeVisible();
  return (await button.innerText()).trim();
}
const proof = (name: string, bytes = '%PDF-1.4\nfixture-bytes') => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.from(bytes),
});

for (const scenario of [
  { type: 'graduated-en', staff: 'staff06', assignee: 'u-staff-6', excluded: 'u-staff-12' },
  { type: 'card', staff: 'staff12', assignee: 'u-staff-12', excluded: 'u-staff-16' },
  { type: 'office365', staff: 'staff16', assignee: 'u-staff-16', excluded: 'u-staff-6' },
]) {
  test(`expanded accounts assign and supplement ${scenario.type}`, async ({ page, context }) => {
    await login(page, 'admin01', '/v2/admin/requests');
    await page
      .getByRole('combobox', { name: 'Loại đề nghị', exact: true })
      .selectOption(scenario.type);
    await page
      .getByRole('group', { name: 'Hàng đợi nhanh' })
      .getByRole('button', { name: /^Chưa phân công/ })
      .click();
    const row = page.locator('#work-queue tbody tr').first();
    const rowText = await row.innerText();
    const mssv = rowText.match(/DEMO(\d{3})/);
    const studentAccount = mssv
      ? `student${String(Number(mssv[1])).padStart(2, '0')}`
      : 'student01';
    const button = row.getByRole('button', { name: /^YC-DEMO-/ });
    const id = (await button.innerText()).trim();
    await button.click();
    await expect(
      page.getByLabel('Chuyên viên phụ trách').locator(`option[value="${scenario.excluded}"]`),
    ).toHaveCount(0);
    await expect(
      page.getByLabel('Chuyên viên phụ trách').locator(`option[value="${scenario.assignee}"]`),
    ).toContainText(scenario.staff);
    await assign(page, scenario.assignee);
    const staff = await context.newPage();
    await login(staff, scenario.staff, '/v2/staff/requests');
    await staff.locator('#work-queue').getByRole('button', { name: id, exact: true }).click();
    await advance(staff, 'received', 'Chuyên viên mới đã tiếp nhận.');
    await advance(staff, 'validating', 'Đang đối chiếu hồ sơ.');
    await advance(staff, 'supplement', 'Vui lòng bổ sung bản chụp rõ thông tin.');
    const studentPage = await context.newPage();
    await login(studentPage, studentAccount, '/v2/services/requests');
    await studentPage.getByRole('link', { name: 'Theo dõi đơn', exact: true }).click();
    await studentPage.getByRole('button', { name: id, exact: true }).click();
    await studentPage
      .getByLabel('Nội dung bổ sung', { exact: true })
      .fill('Em gửi lại minh chứng rõ thông tin.');
    await studentPage.locator('#supplement-files').setInputFiles(proof('additional-demo.pdf'));
    await studentPage.getByRole('button', { name: 'Gửi bổ sung', exact: true }).click();
    await studentPage
      .getByRole('dialog')
      .getByRole('button', { name: 'Xác nhận gửi bổ sung' })
      .click();
    await expect(
      staff.getByRole('link', { name: 'Tải additional-demo.pdf', exact: true }),
    ).toBeVisible();
    await expect(staff.getByLabel('Bước xử lý tiếp theo')).toBeVisible();
    await studentPage.getByRole('tab', { name: 'Nhật ký xử lý' }).click();
    await expect(
      studentPage.getByText('Chuyên viên mới đã tiếp nhận.', { exact: true }),
    ).toBeVisible();
  });
}

for (const prefix of ['', '/v2']) {
  test(`certificate completes across student, admin and staff ${prefix || 'v1'}`, async ({
    context,
    page,
  }, testInfo) => {
    test.setTimeout(90000);
    await login(page, 'student01', `${prefix}/services/requests`);
    await page.getByLabel('Nhóm thủ tục').selectOption('Lập đơn đề nghị');
    await page.getByLabel('Loại đơn đề nghị:').selectOption('it-certificate');
    for (const [label, value] of [
      ['Tên chứng chỉ', 'Ứng dụng CNTT cơ bản'],
      ['Số hiệu / số vào sổ', 'CNTT-2026-001'],
      ['Đơn vị cấp', 'Đơn vị cấp mẫu'],
      ['Ngày thi', '2026-01-01'],
      ['Ngày cấp', '2026-01-15'],
      ['Điểm / xếp loại', 'Đạt'],
      ['Chương trình chứng chỉ CNTT', 'Ứng dụng CNTT'],
      ['Đơn vị tổ chức thi', 'Đơn vị tổ chức mẫu'],
      ['Cấp độ / module', 'Cơ bản'],
    ])
      await page.getByLabel(label, { exact: false }).fill(value);
    await page.getByLabel('Mục đích công nhận').selectOption('Chuẩn đầu ra');
    await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
    await expect(page.getByText('Vui lòng đính kèm minh chứng bắt buộc.')).toBeVisible();
    const original = proof('certificate.pdf');
    await page.locator('#request-file').setInputFiles(original);
    await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
    await page.getByRole('button', { name: 'Xác nhận nộp', exact: true }).click();
    const rowButton = page.getByRole('button', { name: /^YC-\d{4}-/ }).first();
    const id = (await rowButton.innerText()).trim();
    await rowButton.click();
    const admin = await context.newPage();
    await login(admin, 'admin01', `${prefix}/admin/requests`);
    await admin.screenshot({ path: testInfo.outputPath('admin-desktop.png'), fullPage: true });
    await admin.locator('#work-queue').getByRole('button', { name: id, exact: true }).click();
    await expect(admin.getByLabel('Bước xử lý tiếp theo')).toHaveCount(0);
    await expect(
      admin.getByLabel('Chuyên viên phụ trách').locator('option[value="u-staff-2"]'),
    ).toHaveCount(0);
    await assign(admin);
    await expect(page.getByText('Nguyễn Minh Anh', { exact: true }).first()).toBeVisible();
    const staff = await context.newPage();
    await login(staff, 'staff01', `${prefix}/staff/requests`);
    await staff.locator('#work-queue').getByRole('button', { name: id, exact: true }).click();
    const downloaded = staff.waitForEvent('download');
    await staff.getByRole('link', { name: 'Tải certificate.pdf', exact: true }).click();
    expect(await readFile((await (await downloaded).path())!)).toEqual(original.buffer);
    await advance(staff, 'received', 'Đã tiếp nhận hồ sơ.');
    await advance(staff, 'validating', 'Đang kiểm tra chứng chỉ.');
    await expect(
      staff.getByRole('button', { name: 'Cập nhật trạng thái', exact: true }),
    ).toBeDisabled();
    await advance(staff, 'supplement', 'Bổ sung mặt sau chứng chỉ.');
    await staff.getByLabel('Ghi chú nội bộ', { exact: true }).fill('Đã liên hệ đơn vị cấp.');
    await staff.getByRole('button', { name: 'Lưu phiếu kiểm tra' }).click();
    await expect(staff.getByRole('status')).toContainText('Đã lưu phiếu kiểm tra');
    await expect(
      page
        .getByRole('complementary', { name: 'Thao tác sinh viên' })
        .getByText('Bổ sung mặt sau chứng chỉ.', { exact: true }),
    ).toBeVisible();
    await page.getByLabel('Nội dung bổ sung', { exact: true }).fill('Em gửi bổ sung mặt sau.');
    await page.locator('#supplement-files').setInputFiles(proof('back.pdf', '%PDF-back'));
    await page.getByRole('button', { name: 'Gửi bổ sung', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận gửi bổ sung' }).click();
    await expect(staff.getByRole('link', { name: 'Tải back.pdf', exact: true })).toBeVisible();
    await staff.getByLabel('Đã đối chiếu thông tin sinh viên', { exact: true }).check();
    await staff.getByLabel('Đã kiểm tra thành phần hồ sơ', { exact: true }).check();
    await staff.getByLabel('Tình trạng xác minh').selectOption('valid');
    await staff
      .getByLabel('Kênh xác minh', { exact: true })
      .fill('Tra cứu và đối chiếu với đơn vị cấp');
    await staff.getByLabel('Ngày xác minh', { exact: true }).fill('2026-10-01');
    await staff.getByLabel('Mã / tham chiếu xác minh', { exact: true }).fill('DEMO-VERIFY-001');
    await staff
      .getByLabel('Kết quả xác minh', { exact: true })
      .fill('Đã đối chiếu số hiệu với đơn vị cấp.');
    await staff.getByLabel('Ghi chú nội bộ', { exact: true }).fill('PRIVATE-REVIEW-NOTE');
    await advance(staff, 'verified', 'Đã thẩm tra chứng chỉ.');
    await staff.getByLabel('Mức công nhận đề xuất', { exact: true }).fill('Ứng dụng CNTT cơ bản');
    await staff
      .getByLabel('Kiến nghị xử lý', { exact: true })
      .fill('Đề nghị công nhận theo quy định áp dụng');
    await staff
      .getByLabel('Người / đơn vị thẩm định', { exact: true })
      .fill('Đơn vị thẩm định mẫu');
    await advance(staff, 'review', 'Trình cấp có thẩm quyền công nhận.');
    await staff.getByLabel('Số văn bản / quyết định', { exact: true }).fill('QD-DEMO-001');
    await staff.getByLabel('Ngày quyết định', { exact: true }).fill('2026-10-02');
    await staff
      .getByLabel('Kết luận quyết định', { exact: true })
      .fill('Công nhận theo quyết định đã ban hành');
    await staff.locator('#result-files').setInputFiles(proof('decision-reference.pdf'));
    await advance(staff, 'decision', 'Ghi nhận quyết định công nhận.');
    await page.getByRole('tab', { name: 'Kết quả', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Tải decision-reference.pdf' })).toHaveCount(0);
    await staff
      .getByLabel('Tham chiếu bàn giao / kết quả thực hiện', { exact: true })
      .fill('UPDATE-DEMO-001');
    await staff
      .getByLabel('Ghi nhận cập nhật hệ thống đào tạo', { exact: true })
      .fill('Đã cập nhật hệ thống bên ngoài');
    await advance(staff, 'updated', 'Đã cập nhật kết quả theo quyết định.');
    await staff.getByLabel('Kênh trả kết quả', { exact: true }).selectOption('digital');
    await staff
      .getByLabel('Kết quả và hướng dẫn nhận', { exact: true })
      .fill('Đã công nhận chứng chỉ CNTT. Xem bản tham khảo trong hồ sơ.');
    await advance(staff, 'ready', 'Kết quả đã sẵn sàng.');
    await staff.getByLabel('Đã trả kết quả / gửi thông báo', { exact: true }).check();
    await advance(staff, 'completed', 'Đã trả kết quả cho sinh viên.');
    await expect(
      page.getByText('Đã công nhận chứng chỉ CNTT. Xem bản tham khảo trong hồ sơ.', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tải decision-reference.pdf', exact: true }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Nhật ký xử lý' }).click();
    await expect(page.getByText('PRIVATE-REVIEW-NOTE')).toHaveCount(0);
    await expect(page.locator('.request-timeline')).toContainText('Đã trả kết quả cho sinh viên.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: testInfo.outputPath('student-mobile.png'), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await staff.reload();
    await staff.getByLabel('Tên đăng nhập', { exact: true }).fill('staff01');
    await staff.getByLabel('Mật khẩu', { exact: true }).fill('staff123');
    await staff.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(
      staff.getByRole('link', { name: 'Tải certificate.pdf', exact: true }),
    ).toBeVisible();
    await expect(staff.getByRole('heading', { name: 'Hồ sơ đã kết thúc' })).toBeVisible();
  });
}

test('staff role guards routes and exposes only assigned records', async ({ page }) => {
  await login(page, 'staff03', '/staff/requests');
  await expect(
    page
      .locator('#work-queue')
      .getByRole('button', { name: /^YC-DEMO-/ })
      .first(),
  ).toBeVisible();
  await expect(
    page.locator('#work-queue tbody tr').filter({ hasNotText: 'Hỗ trợ CNTT' }),
  ).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Điều phối hồ sơ', exact: true })).toHaveCount(0);
  await page.evaluate(() => {
    history.pushState({}, '', '/admin/requests');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page).toHaveURL(/\/staff\/requests$/);
  await page.evaluate(() => {
    history.pushState({}, '', '/staff/requests?id=not-assigned');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('alert')).toContainText('không có quyền truy cập');
  await expect(page.getByLabel('Bước xử lý tiếp theo')).toHaveCount(0);
});

test('document delivery requires external signature, seal and pickup details; rejection requires a reason', async ({
  page,
  context,
}) => {
  await login(page, 'student01', '/services/requests');
  const id = await newDocument(page, 'student-confirmation');
  const admin = await context.newPage();
  await login(admin, 'admin01', '/admin/requests');
  await admin.locator('#work-queue').getByRole('button', { name: id, exact: true }).click();
  await assign(admin, 'u-staff-2');
  const staff = await context.newPage();
  await login(staff, 'staff02', `/staff/requests?id=${id}`);
  await advance(staff, 'received', 'Đã tiếp nhận giấy xác nhận');
  await advance(staff, 'validating', 'Đối chiếu thông tin sinh viên');
  await staff.getByLabel('Đã đối chiếu thông tin sinh viên', { exact: true }).check();
  await staff.getByLabel('Đã kiểm tra thành phần hồ sơ', { exact: true }).check();
  await advance(staff, 'review', 'Trình cấp có thẩm quyền ký');
  await staff.getByLabel('Phản hồi cho sinh viên', { exact: true }).fill('Đã ký bên ngoài');
  await staff.getByLabel('Xác nhận thao tác bên ngoài đã thực hiện', { exact: false }).check();
  await expect(
    staff.getByRole('button', { name: 'Cập nhật trạng thái', exact: true }),
  ).toBeDisabled();
  await staff.getByLabel('Tham chiếu văn bản đã ký', { exact: true }).fill('DEMO-SIGN-001');
  await advance(staff, 'signed', 'Đơn vị đã ký văn bản');
  await staff.getByLabel('Ghi nhận đóng dấu', { exact: true }).fill('DEMO-SEAL-001');
  await advance(staff, 'sealed', 'Đơn vị đã đóng dấu');
  await staff.getByLabel('Kênh trả kết quả', { exact: true }).selectOption('pickup');
  await expect(
    staff.getByLabel('Kênh trả kết quả', { exact: true }).locator('option[value="digital"]'),
  ).toHaveCount(0);
  await staff.getByLabel('Địa điểm nhận', { exact: true }).fill('Bộ phận HC1C');
  await staff.getByLabel('Thời gian nhận', { exact: true }).fill('Theo lịch hẹn ngày làm việc');
  await staff
    .getByLabel('Giấy tờ / hướng dẫn khi nhận', { exact: true })
    .fill('Mang thẻ sinh viên');
  await staff
    .getByLabel('Kết quả và hướng dẫn nhận', { exact: true })
    .fill('Giấy đã sẵn sàng tại HC1C');
  await advance(staff, 'ready', 'Mời sinh viên đến nhận giấy');
  await page.getByRole('button', { name: id, exact: true }).click();
  await page.getByRole('tab', { name: 'Kết quả', exact: true }).click();
  await expect(page.getByText('Bộ phận HC1C', { exact: true })).toBeVisible();
  await expect(
    staff.getByRole('button', { name: 'Cập nhật trạng thái', exact: true }),
  ).toBeDisabled();
  await staff.getByLabel('Đã trả kết quả / gửi thông báo', { exact: true }).check();
  await advance(staff, 'completed', 'Đã bàn giao bản giấy cho sinh viên');
  await staff.getByRole('button', { name: '← Quay lại danh sách' }).click();
  await staff
    .locator('#work-queue')
    .getByRole('button', { name: /^YC-DEMO-002-/ })
    .click();
  await staff.getByLabel('Bước xử lý tiếp theo').selectOption('rejected');
  await expect(
    staff.getByRole('button', { name: 'Cập nhật trạng thái', exact: true }),
  ).toBeDisabled();
  await advance(staff, 'rejected', 'Hồ sơ mẫu không đáp ứng điều kiện của đợt');
  await expect(staff.getByRole('heading', { name: 'Hồ sơ đã kết thúc' })).toBeVisible();
});

test('cancellation preserves history and seeded prior steps are never marked complete', async ({
  page,
}) => {
  await login(page, 'student01', '/services/requests?view=history');
  await expect(page.getByRole('button', { name: /^YC-DEMO-005-/ })).toHaveCount(0);
  await page.getByRole('button', { name: /^YC-DEMO-001-/ }).click();
  await page.getByText('Các bước của quy trình', { exact: false }).click();
  await expect(page.locator('.request-steps [data-done="true"]')).toHaveCount(0);
  await page.getByRole('button', { name: '← Quay lại danh sách' }).click();
  await page.getByRole('button', { name: /^YC-DEMO-003-/ }).click();
  await page.getByLabel('Lý do hủy').fill('Nộp nhầm loại đơn.');
  await page.getByRole('button', { name: 'Hủy hồ sơ', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận hủy', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Nhật ký xử lý' }).click();
  await expect(page.getByText('Nộp nhầm loại đơn.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hủy hồ sơ', exact: true })).toHaveCount(0);
});

test('certificate fields adapt to exam and draft survives catalog changes; preview restores focus', async ({
  page,
}) => {
  await login(page, 'student01', '/v2/services/requests');
  await page.getByLabel('Tìm thủ tục', { exact: true }).fill('chứng chỉ');
  await page
    .getByRole('button', { name: 'Chọn Công nhận chứng chỉ ngoại ngữ', exact: true })
    .click();
  await page.getByLabel('Loại bài thi').selectOption('IELTS');
  await expect(page.getByLabel('Điểm nói', { exact: false })).toBeVisible();
  await page.getByLabel('Loại bài thi').selectOption('TOEIC Listening & Reading');
  await expect(page.getByLabel('Điểm nói', { exact: false })).toHaveCount(0);
  await expect(page.getByLabel('Điểm nghe', { exact: false })).toBeVisible();
  await page.getByLabel('Tên chứng chỉ', { exact: false }).fill('Draft TOEIC');
  await page.locator('#request-file').setInputFiles(proof('draft.pdf'));
  await page.getByRole('button', { name: 'Chọn Công nhận chứng chỉ CNTT', exact: true }).click();
  await page
    .getByRole('button', { name: 'Chọn Công nhận chứng chỉ ngoại ngữ', exact: true })
    .click();
  await expect(page.getByLabel('Tên chứng chỉ', { exact: false })).toHaveValue('Draft TOEIC');
  const preview = page.getByRole('button', { name: 'Xem draft.pdf', exact: true });
  await preview.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preview).toBeFocused();
  await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
  await expect(page.getByLabel('Số hiệu / số vào sổ', { exact: false })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('admin reassignment updates workload and revokes old staff while preserving private audit', async ({
  context,
  page,
}) => {
  await login(page, 'student01', '/v2/services/requests');
  const id = await newDocument(page);
  const admin = await context.newPage();
  await login(admin, 'admin01', '/v2/admin/requests');
  await admin.locator('#work-queue').getByRole('button', { name: id, exact: true }).click();
  await assign(admin, 'u-staff-1', 'PRIVATE-ASSIGNMENT');
  const staff = await context.newPage();
  await login(staff, 'staff01', '/v2/staff/requests');
  await expect(
    staff.locator('#work-queue').getByRole('button', { name: id, exact: true }),
  ).toBeVisible();
  await assign(admin, 'u-staff-4', 'PRIVATE-REASSIGNMENT');
  await expect(
    staff.locator('#work-queue').getByRole('button', { name: id, exact: true }),
  ).toHaveCount(0);
  const newStaff = await context.newPage();
  await login(newStaff, 'staff04', '/v2/staff/requests');
  await expect(
    newStaff.locator('#work-queue').getByRole('button', { name: id, exact: true }),
  ).toBeVisible();
  await admin.getByRole('tab', { name: 'Nhật ký xử lý' }).click();
  await expect(admin.locator('.request-audit-diff').first()).toContainText('Nguyễn Minh Anh');
  await expect(admin.locator('.request-audit-diff').first()).toContainText('Phạm Ngọc Lan');
  await page.getByRole('button', { name: id, exact: true }).click();
  await page.getByRole('tab', { name: 'Nhật ký xử lý' }).click();
  await expect(page.getByText('PRIVATE-ASSIGNMENT')).toHaveCount(0);
  await expect(page.getByText('PRIVATE-REASSIGNMENT')).toHaveCount(0);
});

test('two staff tabs retain unsaved edits and require explicit reload after a revision change', async ({
  context,
  page,
}) => {
  await login(page, 'staff03', '/staff/requests');
  const button = page.locator('#work-queue').getByRole('button', { name: /^YC-DEMO-014-/ });
  const id = (await button.innerText()).trim();
  await button.click();
  const second = await context.newPage();
  await login(second, 'staff03', `/staff/requests?id=${id}`);
  await page.getByLabel('Ghi chú nội bộ', { exact: true }).fill('KEEP-MY-UNSAVED-NOTE');
  await advance(second, 'validating', 'Bắt đầu kiểm tra sự cố tài khoản');
  await expect(page.getByText('Hồ sơ đã được cập nhật ở tab khác.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Ghi chú nội bộ', { exact: true })).toHaveValue(
    'KEEP-MY-UNSAVED-NOTE',
  );
  await expect(page.getByRole('button', { name: 'Lưu phiếu kiểm tra' })).toBeDisabled();
  await page.getByRole('button', { name: 'Tải phiên bản mới' }).click();
  await page.getByRole('button', { name: 'Bỏ nháp và tiếp tục' }).click();
  await expect(page.getByLabel('Bước xử lý tiếp theo')).toHaveValue('updated');
});

test('confirmed demo reset retains user submissions and does not reseed on reload', async ({
  context,
  page,
}) => {
  await login(page, 'student01', '/services/requests');
  const id = await newDocument(page);
  const admin = await context.newPage();
  await login(admin, 'admin01', '/admin/requests');
  const demoSummary = admin.locator('summary').filter({ hasText: 'Dữ liệu trải nghiệm' });
  await expect(demoSummary).toContainText('hồ sơ mẫu');
  const demoRecordCount = Number((await demoSummary.innerText()).match(/· (\d+)/)![1]);
  expect(demoRecordCount).toBeGreaterThan(400);
  await demoSummary.click();
  await expect(admin.getByRole('button', { name: /Đã nạp bộ mẫu v\d+/ })).toBeDisabled();
  await admin.getByRole('button', { name: 'Đặt lại dữ liệu mẫu' }).click();
  await expect(admin.getByRole('dialog')).toContainText('Giữ nguyên 1 hồ sơ');
  await admin.getByRole('button', { name: 'Hủy thao tác' }).click();
  await expect(admin.locator('#work-queue').getByRole('button', { name: /^YC-/ })).toHaveCount(
    demoRecordCount + 1,
  );
  await admin.getByRole('button', { name: 'Đặt lại dữ liệu mẫu' }).click();
  await admin.getByRole('button', { name: 'Xác nhận đặt lại' }).click();
  await expect(admin.locator('#work-queue').getByRole('button', { name: /^YC-/ })).toHaveCount(
    demoRecordCount + 1,
  );
  await expect(page.getByRole('button', { name: id, exact: true })).toBeVisible();
  await login(admin, 'admin01', '/admin/requests');
  await expect(admin.locator('#work-queue').getByRole('button', { name: /^YC-/ })).toHaveCount(
    demoRecordCount + 1,
  );
});

test('admin can add the expanded dataset while retaining edited v2 cases', async ({ page }) => {
  await login(page, 'admin01', '/admin/requests');
  await expect(page.locator('#work-queue tbody tr').first()).toBeVisible();
  // Isolated Playwright database: reproduce an existing v2 installation and a saved edit.
  const originalId = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('dut-request-workflow', 2);
      open.onsuccess = () => resolve(open.result);
    });
    let original = '';
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['requests', 'meta'], 'readwrite');
      const cursor = tx.objectStore('requests').openCursor();
      cursor.onsuccess = () => {
        const item = cursor.result;
        if (!item) return;
        const ordinal = Number(item.value.id.split('-')[2]);
        if (ordinal > 40) item.delete();
        else {
          const record = item.value;
          record.demo.version = 2;
          if (ordinal === 1) {
            original = record.id;
            record.review.internalNote = 'Ghi chú đã lưu trên bộ v2';
            record.revision = 7;
          }
          item.update(record);
        }
        item.continue();
      };
      tx.objectStore('meta').put({ key: 'demo', version: 2 });
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    return original;
  });
  await login(page, 'admin01', '/admin/requests');
  const summary = page.locator('summary').filter({ hasText: 'Dữ liệu trải nghiệm' });
  await expect(summary).toContainText('40 hồ sơ mẫu');
  await summary.click();
  await page.getByRole('button', { name: 'Nạp thêm bộ mẫu v3' }).click();
  await expect(page.getByRole('dialog')).toContainText('Giữ nguyên toàn bộ 40 hồ sơ hiện có');
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận nạp mẫu' }).click();
  await expect(page.getByRole('button', { name: 'Đã nạp bộ mẫu v3' })).toBeDisabled();
  await expect(
    page.locator('#work-queue').getByRole('button', { name: originalId, exact: true }),
  ).toBeVisible();
  const preserved = await page.evaluate(async (id) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('dut-request-workflow', 2);
      open.onsuccess = () => resolve(open.result);
    });
    const record = await new Promise<{ revision: number; review: { internalNote: string } }>(
      (resolve) => {
        const get = db.transaction('requests').objectStore('requests').get(id);
        get.onsuccess = () => resolve(get.result);
      },
    );
    db.close();
    return record;
  }, originalId);
  expect(preserved.revision).toBe(7);
  expect(preserved.review.internalNote).toBe('Ghi chú đã lưu trên bộ v2');
  await expect(summary).toContainText('468 hồ sơ mẫu');
});

test('request UI supports tablet, mobile, large text, reduced motion and keyboard tabs', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page, 'student01', '/v2/services/requests');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '24px';
  });
  await page.getByLabel('Nhóm thủ tục').selectOption('Lập đơn đề nghị');
  await page.getByLabel('Loại đơn đề nghị:').selectOption('language-certificate');
  await expect(page.getByRole('textbox', { name: 'Ngoại ngữ', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 812, height: 375 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Theo dõi đơn', exact: true }).click();
  await page.getByRole('button', { name: /^YC-DEMO-001-/ }).click();
  const tab = page.getByRole('tab', { name: 'Hồ sơ & minh chứng' });
  await tab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Kết quả', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Kết quả', exact: true })).toBeVisible();
  await login(page, 'admin01', '/v2/admin/requests');
  await page.locator('summary').filter({ hasText: 'Dữ liệu trải nghiệm' }).click();
  await page.locator('summary').filter({ hasText: 'Tài khoản thử nghiệm' }).click();
  await expect(
    page
      .getByRole('table', { name: 'Danh sách tài khoản chuyên viên thử nghiệm' })
      .locator('tbody tr'),
  ).toHaveCount(16);
  await expect(
    page
      .getByRole('table', { name: 'Danh sách tài khoản sinh viên thử nghiệm' })
      .locator('tbody tr'),
  ).toHaveCount(12);
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('heading', { name: 'Công việc của chuyên viên' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
