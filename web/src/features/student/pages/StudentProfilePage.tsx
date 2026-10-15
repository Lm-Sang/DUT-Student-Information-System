import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useAuth } from '@/features/auth';
import { Card } from '@/shared/ui/Card';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { PageHeading } from '@/shared/ui/PageHeading';
import avatarImage from '@/shared/assets/figma/student-avatar.png';
import { useStudentProfile } from '../hooks/useStudentProfile';

type ProfileTab = 'personal' | 'family';

type ProfileDraft = {
  personalEmail: string;
  phone: string;
  familyPhone: string;
  facebook: string;
  currentAddress: string;
  previousAddress: string;
  province: string;
  ward: string;
  residenceOwner: string;
  motherName: string;
  motherBirthDate: string;
  motherUniversity: boolean;
  fatherName: string;
  fatherBirthDate: string;
  fatherUniversity: boolean;
  familyAddress: string;
  familyProvince: string;
  familyWard: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAddress: string;
  graduateContact: string;
};

const emptyDraft: ProfileDraft = {
  personalEmail: '',
  phone: '',
  familyPhone: '',
  facebook: '',
  currentAddress: '',
  previousAddress: '',
  province: '',
  ward: '',
  residenceOwner: '',
  motherName: '',
  motherBirthDate: '',
  motherUniversity: false,
  fatherName: '',
  fatherBirthDate: '',
  fatherUniversity: false,
  familyAddress: '',
  familyProvince: '',
  familyWard: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  emergencyAddress: '',
  graduateContact: '',
};

function readDraft(key: string): ProfileDraft {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? { ...emptyDraft, ...JSON.parse(saved) } : { ...emptyDraft };
  } catch {
    return { ...emptyDraft };
  }
}

function ProfileSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="shadow-[0_2px_12px_rgba(19,27,46,0.035)]">
      <div className="mb-5 flex items-start gap-3 border-b border-line/70 pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink sm:text-[1.0625rem]">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function InfoCell({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0 border-b border-line/70 px-1 py-3">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p
        className={`mt-1 break-words text-[0.8125rem] font-semibold ${value ? 'text-ink' : 'text-muted'}`}
      >
        {value || <span aria-label="Chưa cập nhật">—</span>}
      </p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = 'Nhập thông tin',
  className = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full !border-line !bg-surface text-[0.8125rem] placeholder:text-muted focus:!border-brand"
      />
    </label>
  );
}

function SaveActions({ message }: { message: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-5">
      <p className="max-w-xl text-xs leading-5 text-muted">
        Bản nháp chỉ lưu trong phiên trình duyệt này; thông tin chưa được gửi đến nhà trường.
      </p>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-action px-5 text-[0.8125rem] font-semibold text-white shadow-[0_3px_10px_rgba(0,82,204,0.16)] hover:bg-brand-hover"
      >
        Lưu bản nháp
      </button>
      {message && (
        <p
          role="status"
          className={`w-full text-xs font-medium ${message.startsWith('Không thể') ? 'text-danger' : 'text-success'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const { data: profile, loading, error, reload } = useStudentProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const storageKey = `dut-student-profile-draft:${user?.studentId ?? user?.id ?? 'student'}`;
  const [draft, setDraft] = useState<ProfileDraft>(() => readDraft(storageKey));
  const [saveMessage, setSaveMessage] = useState('');

  function update<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveMessage('');
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
      setSaveMessage('Đã lưu bản nháp trong phiên trình duyệt này.');
    } catch {
      setSaveMessage('Không thể lưu bản nháp trên trình duyệt này.');
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!profile) return <EmptyState message="Chưa có thông tin hồ sơ sinh viên." />;

  return (
    <div className="space-y-6 pb-3">
      <PageHeading title="Hồ sơ sinh viên" />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5  sm:p-6">
        <div className="relative flex items-center gap-4 sm:gap-5">
          <img
            src={avatarImage}
            alt={`Ảnh đại diện của ${profile.fullName}`}
            className="size-16 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md sm:size-24"
          />
          <div className="min-w-0 flex-1">
            <h2 className="mt-1 text-xl font-bold text-ink sm:text-[1.5rem]">{profile.fullName}</h2>
            <p className="mt-1 text-[0.8125rem] text-muted">{profile.major}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <span className="text-brand">MSSV {profile.studentId}</span>
              <span className="text-muted">Lớp {profile.className}</span>
              <span className="text-muted">Niên khóa {profile.academicYear}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 border-b border-line"
        role="tablist"
        aria-label="Nhóm thông tin hồ sơ"
      >
        {(
          [
            ['personal', 'Thông tin cá nhân'],
            ['family', 'Thông tin nhân thân'],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            id={`profile-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`profile-panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => {
              setActiveTab(tab);
              setSaveMessage('');
            }}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === 'Home'
                  ? 'personal'
                  : event.key === 'End'
                    ? 'family'
                    : tab === 'personal'
                      ? 'family'
                      : 'personal';
              setActiveTab(next);
              setSaveMessage('');
              document.getElementById(`profile-tab-${next}`)?.focus();
            }}
            className={`-mb-px min-h-11 border-b-2 px-4 text-[0.8125rem] font-semibold transition-colors ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id={`profile-panel-${activeTab === 'personal' ? 'family' : 'personal'}`}
        role="tabpanel"
        aria-labelledby={`profile-tab-${activeTab === 'personal' ? 'family' : 'personal'}`}
        hidden
      />

      {activeTab === 'personal' ? (
        <div
          id="profile-panel-personal"
          role="tabpanel"
          aria-labelledby="profile-tab-personal"
          className="space-y-5"
        >
          <ProfileSection title="Thông tin cá nhân" description="Dấu —: chưa có dữ liệu.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCell label="Họ và tên" value={profile.fullName} />
              <InfoCell label="Mã sinh viên" value={profile.studentId} />
              <InfoCell label="Ngày sinh" />
              <InfoCell label="Giới tính" />
              <InfoCell label="Nơi sinh" />
              <InfoCell label="Nơi sinh cũ" />
              <InfoCell label="Dân tộc" />
              <InfoCell label="Quốc tịch" />
              <InfoCell label="Tôn giáo" />
              <InfoCell label="Số CCCD" />
              <InfoCell label="Ngày cấp CCCD" />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Học tập & tài khoản"
            description="Thông tin lớp, chương trình đào tạo và tài khoản do trường cấp."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCell label="Ngành" value={profile.major} />
              <InfoCell label="Lớp" value={profile.className} />
              <InfoCell label="Niên khóa" value={profile.academicYear} />
              <InfoCell label="Chương trình đào tạo" value={profile.major} />
              <InfoCell label="Chương trình 2" />
              <InfoCell label="Tài khoản Office 365 trường cấp" />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Bảo hiểm & thanh toán"
            description="Các thông tin này sẽ hiển thị khi được kết nối với dữ liệu của nhà trường."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCell label="Mã thẻ BHYT" />
              <InfoCell label="Hiệu lực đến ngày" />
              <InfoCell label="Diện được cấp thẻ miễn phí" />
              <InfoCell label="Ngân hàng" />
              <InfoCell label="Tài khoản cá nhân" />
            </div>
          </ProfileSection>

          <form onSubmit={saveDraft}>
            <ProfileSection
              title="Liên hệ & địa chỉ cư trú"
              description="Bạn có thể nhập thông tin liên hệ và lưu bản nháp để tiếp tục trong phiên này."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  label="Email cá nhân"
                  type="email"
                  placeholder="ten@example.com"
                  value={draft.personalEmail}
                  onChange={(value) => update('personalEmail', value)}
                />
                <TextField
                  label="Điện thoại"
                  type="tel"
                  placeholder="Số điện thoại cá nhân"
                  value={draft.phone}
                  onChange={(value) => update('phone', value)}
                />
                <TextField
                  label="Điện thoại gia đình"
                  type="tel"
                  placeholder="Số điện thoại người thân"
                  value={draft.familyPhone}
                  onChange={(value) => update('familyPhone', value)}
                />
                <TextField
                  label="Facebook"
                  placeholder="Liên kết Facebook (nếu có)"
                  value={draft.facebook}
                  onChange={(value) => update('facebook', value)}
                />
              </div>
              <h3 className="mb-4 mt-7 border-l-4 border-brand pl-3 text-sm font-semibold text-ink">
                Địa chỉ cư trú
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  label="Địa chỉ cư trú hiện nay"
                  placeholder="Số nhà, đường, thôn hoặc xóm"
                  value={draft.currentAddress}
                  onChange={(value) => update('currentAddress', value)}
                  className="lg:col-span-2"
                />
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-xs font-medium text-muted">
                    Là địa chỉ của
                  </span>
                  <select
                    value={draft.residenceOwner}
                    onChange={(event) => update('residenceOwner', event.target.value)}
                    className="w-full !border-line !bg-surface text-[0.8125rem]"
                  >
                    <option value="">Chọn loại địa chỉ</option>
                    <option value="family">Gia đình</option>
                    <option value="self">Bản thân</option>
                    <option value="dorm">Ký túc xá</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                <TextField
                  label="Tỉnh / Thành phố"
                  value={draft.province}
                  onChange={(value) => update('province', value)}
                />
                <TextField
                  label="Xã / Phường"
                  value={draft.ward}
                  onChange={(value) => update('ward', value)}
                />
                <TextField
                  label="Địa chỉ cũ (nếu có)"
                  value={draft.previousAddress}
                  onChange={(value) => update('previousAddress', value)}
                />
              </div>
              <SaveActions message={saveMessage} />
            </ProfileSection>
          </form>
        </div>
      ) : (
        <form
          id="profile-panel-family"
          role="tabpanel"
          aria-labelledby="profile-tab-family"
          onSubmit={saveDraft}
          className="space-y-5"
        >
          <ProfileSection
            title="Thông tin cha mẹ"
            description="Thông tin người thân phục vụ liên hệ và quản lý hồ sơ sinh viên."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-line bg-canvas p-4">
                <h3 className="mb-4 text-[0.8125rem] font-semibold text-brand">Thông tin mẹ</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Họ và tên mẹ"
                    value={draft.motherName}
                    onChange={(value) => update('motherName', value)}
                  />
                  <TextField
                    label="Ngày sinh mẹ"
                    type="date"
                    placeholder=""
                    value={draft.motherBirthDate}
                    onChange={(value) => update('motherBirthDate', value)}
                  />
                </div>
                <label className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={draft.motherUniversity}
                    onChange={(event) => update('motherUniversity', event.target.checked)}
                    className="size-4 accent-brand"
                  />
                  Có bằng Đại học / Cao đẳng
                </label>
              </div>
              <div className="rounded-xl border border-line bg-canvas p-4">
                <h3 className="mb-4 text-[0.8125rem] font-semibold text-brand">Thông tin cha</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Họ và tên cha"
                    value={draft.fatherName}
                    onChange={(value) => update('fatherName', value)}
                  />
                  <TextField
                    label="Ngày sinh cha"
                    type="date"
                    placeholder=""
                    value={draft.fatherBirthDate}
                    onChange={(value) => update('fatherBirthDate', value)}
                  />
                </div>
                <label className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={draft.fatherUniversity}
                    onChange={(event) => update('fatherUniversity', event.target.checked)}
                    className="size-4 accent-brand"
                  />
                  Có bằng Đại học / Cao đẳng
                </label>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection title="Thường trú gia đình">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TextField
                label="Số nhà, đường"
                value={draft.familyAddress}
                onChange={(value) => update('familyAddress', value)}
              />
              <TextField
                label="Tỉnh / Thành phố"
                value={draft.familyProvince}
                onChange={(value) => update('familyProvince', value)}
              />
              <TextField
                label="Xã / Phường"
                value={draft.familyWard}
                onChange={(value) => update('familyWard', value)}
              />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Liên hệ khẩn cấp & sau tốt nghiệp"
            description="Thông tin này giúp nhà trường liên lạc với người thân khi cần thiết."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TextField
                label="Họ tên người liên hệ"
                value={draft.emergencyName}
                onChange={(value) => update('emergencyName', value)}
              />
              <TextField
                label="Quan hệ"
                value={draft.emergencyRelationship}
                onChange={(value) => update('emergencyRelationship', value)}
              />
              <TextField
                label="Số điện thoại"
                type="tel"
                value={draft.emergencyPhone}
                onChange={(value) => update('emergencyPhone', value)}
              />
              <TextField
                label="Địa chỉ liên hệ khẩn cấp"
                value={draft.emergencyAddress}
                onChange={(value) => update('emergencyAddress', value)}
                className="lg:col-span-2"
              />
              <TextField
                label="Liên hệ sau tốt nghiệp"
                placeholder="Họ tên / Địa chỉ"
                value={draft.graduateContact}
                onChange={(value) => update('graduateContact', value)}
              />
            </div>
            <SaveActions message={saveMessage} />
          </ProfileSection>
        </form>
      )}
    </div>
  );
}
