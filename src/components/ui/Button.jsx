export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'border border-slate-300 bg-white text-ink hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
  }
  return <button className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>
}
