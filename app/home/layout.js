import { Header } from "@/components/home/Header";

export default function HomeLayout({ children, modal }) {
  return (
    <div>
      <Header />
      {modal}
      {children}
    </div>
  );
}
