import Chat from "@/components/Chat";
import Rooms from "@/components/Rooms";
export default function Home() {
  return (
    <main className="flex bg-darkest-purple min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-x-5 w-full md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-6/12">
        <div className="flex flex-col w-full">
          <h1 className="text-white text-2xl font-bold">Salas</h1>
          <Rooms />
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-white text-2xl font-bold">Chat</h1>
          <Chat />
          <div />
        </div>
      </div>
    </main>
  );
}
