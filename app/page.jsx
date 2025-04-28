import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="bg-white relative w-screen h-[90vh]">
      <div className="absolute top-0 z-10 w-screen h-[90vh] bg-black opacity-45">
      </div>
      <Navbar />
      <img
        src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Luxury Property"
        className="w-[100vw] h-[90vh] absolute top-0  object-cover"
      />
      <div className="w-[70vw] z-20 mx-auto h-[50vh] border bg-white border-white rounded-xl">

      </div>

    </div>
  );
}
