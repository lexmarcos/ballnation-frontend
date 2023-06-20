import Chat from "@/components/Chat";
import Rooms from "@/components/Rooms";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex">
        <Rooms />
        <Chat />
      </div>
    </main>
  );
}
