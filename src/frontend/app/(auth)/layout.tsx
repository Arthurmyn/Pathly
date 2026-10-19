/** Sign up and log in use their own full-bleed layout, without the application sidebar. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main id="content">{children}</main>;
}
