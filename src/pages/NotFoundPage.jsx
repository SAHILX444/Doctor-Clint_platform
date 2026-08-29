import { Link } from 'react-router-dom'
export function NotFoundPage() { return <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center"><div><p className="text-sm font-bold text-brand">404</p><h1 className="mt-2 text-3xl font-bold">Page not found</h1><Link className="mt-5 inline-block font-semibold text-brand" to="/login">Return to login</Link></div></main> }
