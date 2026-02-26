// import Image from "next/image";
// import Link from "next/link";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-[#FFF7EE] text-[#1b1b1b]">

//       {/* ================= NAVBAR ================= */}
//       <header className="sticky top-0 z-50 border-b border-orange-200 bg-[#FFF7EE]/90 backdrop-blur">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//           <Link href="/" className="text-2xl font-extrabold text-orange-600">
//             Slice of Heaven
//           </Link>

//           <nav className="hidden md:flex gap-10 text-sm font-semibold text-orange-700">
//             <a href="#home" className="hover:underline">Home</a>
//             <a href="#about" className="hover:underline">About</a>
//             <a href="#menu" className="hover:underline">Menu</a>
//             <a href="#contact" className="hover:underline">Contact</a>
//           </nav>

//           <div className="flex gap-3">
//             <Link
//               href="/login"
//               className="rounded-full border border-orange-300 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
//             >
//               Log in
//             </Link>
//             <Link
//               href="/register"
//               className="rounded-full bg-[#E39A3B] px-5 py-2 text-sm font-extrabold text-black hover:opacity-90"
//             >
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ================= HERO ================= */}
//       <section id="home" className="py-20">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

//             <div>
//               <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight">
//                 Your favorite{" "}
//                 <span className="text-orange-600">Pizzas</span>, <br />
//                 just a few clicks <br />
//                 away!
//               </h1>

//               <div className="mt-8 flex gap-4">
//                 <Link
//                   href="/user/dashboard"
//                   className="rounded-full bg-[#E39A3B] px-7 py-3 text-sm font-extrabold text-black hover:opacity-90"
//                 >
//                   Order Now
//                 </Link>
//                 <a
//                   href="#menu"
//                   className="rounded-full border border-orange-300 px-7 py-3 text-sm font-bold text-orange-800 hover:bg-orange-50"
//                 >
//                   View Menu
//                 </a>
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <div className="relative h-[420px] w-[420px]">
//                 <Image
//                   src="/first.png"
//                   alt="Pizza"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= ABOUT ================= */}
//       <section id="about" className="py-20">
//         <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12">

//           <div className="md:col-span-5">
//             <Image
//               src="/about.jpg"
//               alt="Pizza slice"
//               width={600}
//               height={600}
//               className="rounded-3xl object-contain"
//             />
//           </div>

//           <div className="md:col-span-7 bg-[#F8EBDD] rounded-3xl p-10">
//             <h2 className="text-3xl font-extrabold text-orange-700">
//               ABOUT US
//             </h2>

//             <p className="mt-4 text-sm text-orange-900/70 leading-6">
//               Slice of Heaven is an online pizza ordering platform created to
//               deliver happiness, one slice at a time.
//             </p>

//             <div className="mt-8 grid grid-cols-2 gap-6">
//               <Feature title="Fast Delivery" />
//               <Feature title="Best Quality" />
//               <Feature title="24/7 Service" />
//               <Feature title="Easy Ordering" />
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= CONTACT ================= */}
//       <section id="contact" className="pb-20">
//         <div className="mx-auto max-w-7xl px-6 bg-[#F8EBDD] rounded-3xl p-12">
//           <h2 className="text-center text-4xl font-black">
//             We’d Love to Hear From You
//           </h2>

//           <div className="mt-12 grid md:grid-cols-2 gap-12">

//             <div>
//               <input className="w-full border-b bg-transparent py-2 outline-none mb-4" placeholder="Name" />
//               <input className="w-full border-b bg-transparent py-2 outline-none mb-4" placeholder="Email" />
//               <textarea className="w-full border-b bg-transparent py-2 outline-none mb-4" placeholder="Message" />
//               <button className="bg-[#E39A3B] px-6 py-2 rounded-lg font-bold">
//                 Send Message
//               </button>
//             </div>

//             <div>
//               <Image
//                 src="/contact.png"
//                 alt="Pizza"
//                 width={600}
//                 height={400}
//                 className="rounded-2xl object-contain"
//               />
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= FOOTER ================= */}
//       <footer className="border-t border-orange-200 py-6">
//         <div className="mx-auto max-w-7xl px-6 flex justify-between text-sm text-orange-900/60">
//           <p>© 2026 Slice of Heaven</p>
//           <div className="flex gap-6">
//             <a href="#home">Home</a>
//             <a href="#about">About</a>
//             <a href="#contact">Contact</a>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }

// function Feature({ title }: { title: string }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="h-8 w-8 rounded-lg bg-white grid place-items-center shadow">
//         ✓
//       </div>
//       <span className="text-sm font-semibold text-orange-800">
//         {title}
//       </span>
//     </div>
//   );
// }

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF7EE] text-[#1b1b1b]">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-orange-200 bg-[#FFF7EE]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-4">
          {/* Brand */}
          <Link
            href="/"
            className="text-3xl font-extrabold text-orange-600 whitespace-nowrap"
          >
            Slice of Heaven
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-orange-700 mx-auto">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>

            {/* ✅ Menu routes to dashboard */}
            <Link href="/dashboard" className="hover:underline">
              Menu
            </Link>

            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </nav>

          {/* Right buttons (pinned to far right) */}
          <div className="ml-auto flex gap-3">
            <Link
              href="/login"
              className="rounded-full border border-orange-300 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#E39A3B] px-5 py-2 text-sm font-extrabold text-black hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight">
                Your favorite{" "}
                <span className="text-orange-600">Pizzas</span>, <br />
                just a few clicks <br />
                away!
              </h1>

              <div className="mt-8 flex gap-4">
                {/* ✅ Also route to dashboard */}
                <Link
                  href="/dashboard"
                  className="rounded-full bg-[#E39A3B] px-7 py-3 text-sm font-extrabold text-black hover:opacity-90"
                >
                  Order Now
                </Link>
                <a
                  href="#menu"
                  className="rounded-full border border-orange-300 px-7 py-3 text-sm font-bold text-orange-800 hover:bg-orange-50"
                >
                  View Menu
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative h-[420px] w-[420px]">
                <Image
                  src="/first.png"
                  alt="Pizza"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Image
              src="/about.jpg"
              alt="Pizza slice"
              width={600}
              height={600}
              className="rounded-3xl object-contain"
            />
          </div>

          <div className="md:col-span-7 bg-[#F8EBDD] rounded-3xl p-10">
            <h2 className="text-3xl font-extrabold text-orange-700">
              ABOUT US
            </h2>

            <p className="mt-4 text-sm text-orange-900/70 leading-6">
              Slice of Heaven is an online pizza ordering platform created to
              deliver happiness, one slice at a time.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <Feature title="Fast Delivery" />
              <Feature title="Best Quality" />
              <Feature title="24/7 Service" />
              <Feature title="Easy Ordering" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="pb-20">
        <div className="mx-auto max-w-7xl px-6 bg-[#F8EBDD] rounded-3xl p-12">
          <h2 className="text-center text-4xl font-black">
            We’d Love to Hear From You
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-12">
            <div>
              <input
                className="w-full border-b bg-transparent py-2 outline-none mb-4"
                placeholder="Name"
              />
              <input
                className="w-full border-b bg-transparent py-2 outline-none mb-4"
                placeholder="Email"
              />
              <textarea
                className="w-full border-b bg-transparent py-2 outline-none mb-4"
                placeholder="Message"
              />
              <button className="bg-[#E39A3B] px-6 py-2 rounded-lg font-bold">
                Send Message
              </button>
            </div>

            <div>
              <Image
                src="/contact.png"
                alt="Pizza"
                width={600}
                height={400}
                className="rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-orange-200 py-6">
        <div className="mx-auto max-w-7xl px-6 flex justify-between text-sm text-orange-900/60">
          <p>© 2026 Slice of Heaven</p>
          <div className="flex gap-6">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-white grid place-items-center shadow">
        ✓
      </div>
      <span className="text-sm font-semibold text-orange-800">{title}</span>
    </div>
  );
}
