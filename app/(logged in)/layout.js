import { Header } from "@/components/Header";

export default function LoggedLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
