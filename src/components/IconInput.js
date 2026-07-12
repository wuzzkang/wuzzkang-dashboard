'use client';

/**
 * IconInput — Input field dengan ikon di sisi kiri.
 *
 * Menggantikan pola berulang di halaman login dan update-password.
 *
 * Props:
 * @param {React.ReactNode} icon        - Elemen ikon (misal: <Mail className="h-4 w-4" />)
 * @param {string}   type               - Tipe input HTML (text, email, password, dll)
 * @param {string}   placeholder        - Placeholder teks
 * @param {string}   value              - Nilai terkontrol
 * @param {Function} onChange           - Handler perubahan nilai
 * @param {string}   [id]               - ID elemen input
 * @param {string}   [name]             - Name atribut input
 * @param {boolean}  [required]         - Apakah field wajib diisi
 * @param {boolean}  [disabled]         - Apakah field dinonaktifkan
 * @param {string}   [autoComplete]     - Nilai atribut autocomplete
 * @param {string}   [className]        - Kelas tambahan pada <input>
 * @param {React.ReactNode} [rightAddon] - Elemen tambahan di sisi kanan (mis: tombol show/hide password)
 */
export default function IconInput({
  icon,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  id,
  name,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  rightAddon,
  ...rest
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-text-muted">
          {icon}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`block w-full ${icon ? 'pl-9' : 'pl-3.5'} ${rightAddon ? 'pr-10' : 'pr-3.5'} py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...rest}
      />
      {rightAddon && (
        <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightAddon}
        </span>
      )}
    </div>
  );
}
